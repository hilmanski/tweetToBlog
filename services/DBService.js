const UserModel = require('../models/User')
const BlogModel = require('../models/Blog')

//========================
//== User DB related
//========================
exports.getUser = async function(username) {
    try {
        const res = await UserModel.findOne({ username: username })
        return res
    }catch(err) {
        return console.error(err);
    }
}

exports.saveUser = function (userData) {
    const user = UserModel({
        id: userData.id,
        name: userData.name,
        url: userData.url,
        username: userData.username,
        description: userData.description,
        profile_image_url: userData.profile_image_url
    })

    user.save(function (err, doc) {
        if (err) return console.error(err);
        console.log("User inserted succussfully!");
        return
    });
}

//========================
//== Blog DB related
//========================
exports.getBlog = async function (slug) {
    try {
        const res = await BlogModel.findOne({ slug: slug })
        return res
    } catch (err) {
        return console.error(err);
    }
}

exports.getBlogs = async function(authorID) {
    try {
        const res = await BlogModel.find({ author_id: authorID })
                                    .sort({ createdAt: 'desc' })
        return res
    } catch (err) {
        return console.error(err);
    }
}

exports.saveBlog = function (blogs) {
    BlogModel.insertMany(blogs, function (err, docs) {
        if (err) {
            return console.error(err);
        } else {
            console.log("Multiple documents inserted to Collection");
            return true
        }
    });
}

exports.getLatestBlogByUser = async function (authorID) {
    try {
        const res = await BlogModel.find({ author_id: authorID })
                                .sort({ createdAt: 'desc' }).limit(1)
        
        return res
    } catch (err) {
        return console.error(err);
    }
}
