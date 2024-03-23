const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/post.js');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb+srv://Jaja:jayarbaloloy02@cluster0.tyjf9nl.mongodb.net/Sample?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('Connected to the database');
})
.catch(() => {
    console.log('connection failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, x-Requested-with, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post("/api/posts", (req, res, next) => {
const post = new Post({
   title: req.body.title,
   content: req.body.content
});
post.save()
.then(savedPost => {
console.log(savedPost);
        res.status(201).json({
            message: 'post added successfully'
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: 'Error saving post'
        });
    });
});

app.delete('/api/posts/:_id', async (req, res) => {
    console.log('Attempting to delete post with ID:', req.params._id);
    try {
       const post = await Post.findByIdAndDelete(req.params._id);
       if (!post) {
         console.log('Post not found');
         return res.status(404).json({ message: 'Post not found' });
       }
       console.log('Post deleted successfully');
       res.json({ message: 'Post deleted successfully' });
    } catch (error) {
       console.error('Server error:', error);
       res.status(500).json({ message: 'Server error' });
    }
});


app.get('/api/posts', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: documents
        });
    });
});

app.put('/api/posts/:_id', (req, res, next) => {
    const post = {
        title: req.body.title,
        content: req.body.content
    };

    Post.updateOne({ _id: req.params._id }, { $set: post }, { new: true })
        .then(result => {
            if (result.nModified === 0) {
                // No documents were updated
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(200).json({ message: 'Post updated successfully', post: result });
        })
        .catch(err => {
            console.error('Error updating post:', err);
            res.status(500).json({ message: 'Error updating post', error: err });
        });
});

module.exports = app;