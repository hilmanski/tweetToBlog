const path = require('path');
const moment = require('moment');

const DBService = require('./services/DBService')
const TwitterService = require('./services/TwitterService');
const BlogService = require('./services/BlogService');
const { exit } = require('process');

module.exports = function (app) {
    app.get('/', (req, res) => {
        res.render('welcome')
    })

    //process tweet, convert as blog and save to DB
    app.get('/blogit/:username',  async function(req, res){
        const username = req.params.username
        const resUser = await TwitterService.reqUserData(username)
        
        if (resUser == undefined) {
            res.send({'success': false, 'msg': 'username not found'})
        }

        DBService.saveUser(resUser)
        BlogService.processTweetToBlog(resUser['id']).then(function(){
            res.send({ 'success': true, 'username': username })
        })
    });

    app.get('/blog/:username',  async function(req, res){
        const user = await DBService.getUser(req.params.username)
        const _authorId = user.id
        
        DBService.getBlogs(_authorId).then(function (blogs) {
            res.render('blog', { blogs: blogs, moment: moment, user: user })
        })
    })

    app.get('/blog/show/:slug',  async function(req, res){
        const blog = await DBService.getBlog(req.params.slug)
        res.render('show', { blog: blog, moment: moment })
    })

    app.get('/blog/update/:userId', async function(req, res){
        const latestBlog = await DBService.getLatestBlogByUser(req.params.userId)

        BlogService.processTweetToBlog(latestBlog[0].author_id, latestBlog[0].id)
            .then(function (blogs) {
                //blogs is here if needed
                res.send({'status': 'OKAY'})
            })
    })
}