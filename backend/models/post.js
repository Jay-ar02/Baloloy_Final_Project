const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
<<<<<<< HEAD
    imageUrl: { type: String, required: true },
=======
    imageUrl: { type: String, required: true }
>>>>>>> ba2604454f8094e1daa51ea1927145584e870544
});

module.exports = mongoose.model('Post', PostSchema);