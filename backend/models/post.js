const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
 title: String,
 content: String
}, { collection: 'post' }); // Specify the collection name here

const Post = mongoose.model('Post', postSchema);