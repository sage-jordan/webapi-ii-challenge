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

//POST A COMMENT ( no need to pass params, only body w post_id)
server.post(`/api/posts/:id/comments`, (req, res) => {
    const id = req.body.post_id;
    const comment = req.body;
    if(comment["text"] && id){
        db.insertComment(comment)
            .then(postId => {
                const newFullComment = {
                    ...comment,
                    ...postId
                }
                res.status(201).json({ success: true, newFullComment })
            })
            .catch(err => {
                res.status(501).json({ success: false, err})
            })
    } else {
        res.status(404).json({ success: false, message: `Please provide text and post_id for the comment.`})
    };
});

//GET POSTS
server.get(`/api/posts`, (req, res) => {
    db.find()
        .then(posts => {
            res.status(202).json({ success: true, posts })
        })
        .catch(err => {
            res.status(502).json({ success: false, err })
        });
});

//GET POST BY ID
server.get(`/api/posts/:id`, (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            if(post){
                res.status(203).json({ succcess: true, post })
            } else {
                res.status(404).json({ success: false, message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(503).json({ success: false, err })
        })
})

// GET COMMENTS BY POST ID
server.get(`/api/posts/:id/comments`, (req, res) => {
    const id = req.params.id;
    db.findPostComments(id)
        .then(comments => {
            console.log(comments);
            if(id){
                res.status(204).json({ success: true, comments }); // RETURNS 204 W/ 'NO CONTENT'
            } else {
                res.status(404).json({ success: false, message: "The post with the specified ID does not exist."});
            }
        })
        .catch(err => {
            res.status(504).json({ success: false });
        })
});

//DELETE A POST
server.delete(`/api/posts/:id`, (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(deletedId => {
            if(deletedId){
                res.status(205).json({ success: true, deletedId })
            } else {
                res.status(404).json({ success: false, message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(505).json({ successful: false, err })
        })
})

server.listen(port, () => {
    console.log(`=== Server listening on port ${port} ===`);
})