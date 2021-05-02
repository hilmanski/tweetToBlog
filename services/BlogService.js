const slugify = require('slugify')
const DBService = require('./DBService')
const TwitterService = require('./TwitterService');

exports.processTweetToBlog = async function (userID, latestId = null) {
    const resTimeline = await TwitterService.reqTimeline(userID, latestId)

    //save all tweetID 
    const tweetIds = []
    for (let i in resTimeline.data) {
        tweetIds.push(resTimeline.data[i]['id'])
    }

    const tweets = await TwitterService.reqTweetDetail(tweetIds)
    const blogEntries = convertToBlog(tweets)
    DBService.saveBlog(blogEntries)

    return blogEntries
}

function convertToBlog (tweets) {
    let blogs = []

    for (let i in tweets.data) {
        currenTweet = tweets.data[i]

        if(tweetIsReply(currenTweet))
            continue
        
        //check if not reTweeet
        if(tweetIsRetweet(currenTweet))
            continue

        //check if only link
        if (isOnlyALink(currenTweet['text']))
            continue

        //check if same conversation, combine
        let body = currenTweet['text']
        let createdAt = currenTweet['created_at']
        let prevId = currenTweet['id']
        let prevIndex = blogs.findIndex(_item => _item.conversation_id == currenTweet['conversation_id'])

        if (prevIndex !== -1) {
            body = currenTweet['text'] + " \n\n " + blogs[prevIndex].body
            prevId = blogs[prevIndex].id
            createdAt = blogs[prevIndex].createdAt
            blogs.splice(prevIndex, 1);
        }

        let title = createTitle(body) //important after body declaration
        let thumbnail_url = getMediaIfExists(currenTweet, tweets)

        blogs.push({
            'id': prevId,
            'author_id': currenTweet['author_id'],
            'title': title,
            'slug': slugify(title) + "-" + currenTweet['id'],
            'body': body,
            'createdAt': createdAt,
            'conversation_id': currenTweet['conversation_id'],
            'thumbnail_url': thumbnail_url
        })
    } //end loop

    return blogs
}

function createTitle(str) {
    const maxLen = 30
    if (str.length <= maxLen) return str;
    return str.substr(0, str.lastIndexOf(' ', maxLen));
}

function isOnlyALink(text) {
    var expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    var regex = new RegExp(expression);
    text = text.replace(regex, '')

    if (text == '')
        return true

    return false
}

function tweetIsReply(tweet) {
    if ('in_reply_to_user_id' in tweet) {
        if (tweet['author_id'] != tweet['in_reply_to_user_id']) {
            return true
        }
    }
    return false
}

function tweetIsRetweet(tweet) {
    if (currenTweet['referenced_tweets'] !== undefined) {
        if (currenTweet['referenced_tweets'][0]['type'] == 'retweeted')
            return true
    }
    return false
}

function getMediaIfExists(tweet, tweets) {
    let thumbnail_url = ''
    
    if ('attachments' in tweet) {
        //TODO: Should it loop if more than on media_keys? 
            //currently only for first image.

        let _media = tweets.includes.media
                         .find(item => item.media_key == tweet['attachments']['media_keys'][0])

        if (_media.type == "photo")
            thumbnail_url = _media.url
    }

    return thumbnail_url
}