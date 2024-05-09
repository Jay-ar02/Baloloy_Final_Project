const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:4200' // Allow CORS for requests from this origin
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Define the JWT secret key
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
       return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
   
    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer token"
    if (!token) {
       return res.status(401).json({ message: 'Invalid token format.' });
    }
   
    try {
       const decoded = jwt.verify(token, jwtSecretKey);
       req.user = decoded;
       next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ message: 'Invalid token.' });
    }
    
};


// Connect to MongoDB
mongoose.connect("mongodb+srv://jajabaloloy:jajabaloloy@baloloy.mdwvzrk.mongodb.net/baloloy_db?retryWrites=true&w=majority&appName=Baloloy")
.then(() => {
    console.log('Connected to the database');
})
.catch(() => {
    console.log('connection failed');
});

// User model and routes
const UserSchema = new mongoose.Schema({
    username: {
       type: String,
       required: true,
       unique: true
    },
    password: {
       type: String,
       required: true
    }
   });
   
   UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
       this.password = await bcrypt.hash(this.password, 10);
    }
    next();
   });
   
   UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
   };
   

// Declare User model only once
const User = mongoose.model('User', UserSchema);

// Registration route
app.post('/register', async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password // Make sure to hash the password before saving
        });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        console.log("Login attempt:", req.body); // Log the incoming request body
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found"); // Log when user is not found
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log("Invalid password"); // Log when password is invalid
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate and send token with an expiration time
        const token = jwt.sign({ id: user._id, username: user.username }, jwtSecretKey, { expiresIn: '1m' });
res.json({ token });

    } catch (error) {
        console.error('Login error:', error); // Log any other errors
        res.status(500).json({ message: error.message });
    }
});

// Post model and routes
const PostSchema = new mongoose.Schema({
 title: String,
 content: String,
 imageUrl: String,
});

const Post = mongoose.model('Post', PostSchema);

// Route to create a new post
app.post("/api/posts", verifyToken, async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imageUrl: req.body.imageUrl
            // Remove the userId assignment
        });

        await post.save();
        res.status(201).json({ message: 'post added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error saving post', error: err });
    }
});

// Route to fetch all posts
app.get('/api/posts', async (req, res) => { // Directly use async function
    try {
        const posts = await Post.find();
        res.status(200).json({ message: 'Posts fetched successfully', posts });
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Error fetching posts', error: err.message });
    }
});


// Route to fetch posts by user ID
// app.get('/api/byUser/:userId', async (req, res) => {
//     try {
//         const posts = await Post.find({ userId: req.params.userId }).populate('userId');
//         if (!posts) {
//             return res.status(404).json({ message: 'No posts found for this user' });
//         }
//         res.status(200).json({ message: 'Posts fetched successfully', posts });
//     } catch (error) {
//         console.error('Error fetching posts by user ID:', error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// });

// Start the server on port 3001
const port = 3001;
app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});

app.delete('/api/posts/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Error deleting post', error: err.message });
    }
});

// Route to update a post
app.put('/api/posts/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ message: 'Error updating post', error: err.message });
    }
});

module.exports = app;