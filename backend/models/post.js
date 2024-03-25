const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true } // Ensure this field is included
});

module.exports = mongoose.model('Post', PostSchema);