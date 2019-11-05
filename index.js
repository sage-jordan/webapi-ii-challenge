const express = require('express');
const server = express();
const db = require('./data/db');
const port = 4000;
server.use(express.json());


// POST 
server.post('/api/posts', (req, res) => {
    const newPost = req.body;
    if(newPost["title"] && newPost["contents"]){
        db.insert(newPost)
            .then(postId => {
                const newFullPost = {
                    ...newPost,
                    ...postId
                }
                res.status(200).json({ success: true, newFullPost })
            })
            .catch(err => {
                res.status(500).json({ success: false, err})
            })
    } else {
        res.status(404).json({ success: false, message: `Please provide title and contents for the post.`})
    };
});

server.listen(port, () => {
    console.log(`=== Server listening on port ${port} ===`);
})