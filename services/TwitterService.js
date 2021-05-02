const needle    = require('needle');

const API_ENDPOINT = "https://api.twitter.com/2"
const BEARER_TOKEN = process.env.BEARER_TOKEN; 
const MAX_RESULTS  = 10
const REQ_OPTION   = {
                        headers: {
                            "User-Agent": "v2UserLookupJS",
                            "authorization": `Bearer ${BEARER_TOKEN}`
                        }
                      }

exports.reqUserData = async function(username) {
    const params = {
        "user.fields": "id,created_at,description,profile_image_url,username,url,name"
    }
    
    const URL = `${API_ENDPOINT}/users/by/username/${username}`

    const res = await needle('get', URL, params, REQ_OPTION)

    if (res.body) {
        return res.body.data;
    } else {
        throw new Error('Unsuccessful to request user data')
    }
}

exports.reqTimeline = async function (userId, latestId = null) {
    let params = {
        "tweet.fields": "created_at,id",
        "max_results": MAX_RESULTS,
    }

    if (latestId != null) {
        params = {
            "tweet.fields": "created_at,id",
            "max_results": MAX_RESULTS,
            "since_id": latestId
        }
    }

    const URL = `${API_ENDPOINT}/users/${userId}/tweets`

    try {
        const resp = await needle('get', URL, params, REQ_OPTION);

        if (resp.statusCode != 200) {
            console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
            return;
        }
        return resp.body;
    } catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
}

exports.reqTweetDetail = async function (tweetIds) {
    const params = {
        "ids": tweetIds.toString(),
        "tweet.fields": "created_at,id,author_id,conversation_id,in_reply_to_user_id,referenced_tweets",
        "user.fields": "username",
        "expansions": "attachments.media_keys",
        "media.fields": "media_key,url"
    }

    const URL = `${API_ENDPOINT}/tweets?ids=`

    const res = await needle('get', URL, params, REQ_OPTION)

    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}