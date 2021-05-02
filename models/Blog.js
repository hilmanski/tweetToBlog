const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlogSchema = new Schema({
    id: String,
    conversation_id: String,
    author_id: String,
    title: String,
    slug: String,
    body: String,
    thumbnail_url: String
}, { timestamps: true })

module.exports = mongoose.model('Blog', BlogSchema)