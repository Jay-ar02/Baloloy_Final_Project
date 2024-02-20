const express = require('express');
const app = express();

app.use('/api/posts', (req, res, next) => {
    const posts = [
        { id: 'jaegai287ag',
        title: 'from server-side post',
        content: 'coming from server sife'},
        { id: 'ual8i3yauau',
        title: 'second from server-side post',
        content: 'second coming from server side'}
    ];
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
});

module.exports = app;