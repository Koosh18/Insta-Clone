const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const requireLogin = require('../middleware/requirelogin');

router.post('/createpost', requireLogin, async (req, res) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please add title and body" });
    }

    req.user.password = undefined;
    const newPost = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    });

    try {
        const result = await newPost.save();
        res.json({ post: result });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: "Failed to create post" });
    }
});

router.get('/allpost', requireLogin, async (req, res) => {
    try {
        const posts = await Post.find().populate('postedBy', 'name');
        res.json({ posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});
router.get('/folpost', requireLogin, async (req, res) => {
    try {
        const posts = await Post.find({
            postedBy: { $in: [req.user.following, req.user._id] }
        }).populate('postedBy', 'name pic');

        res.json({ posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});



router.get('/mypost', requireLogin, async (req, res) => {
    try {
        const posts = await Post.find({ postedBy: req.user._id }).populate('postedBy', 'name');
        res.json({ posts });
    } catch (err) {
        console.error("Error fetching user's posts:", err);
        res.status(500).json({ error: "Failed to fetch user's posts" });
    }
});

router.put('/like', requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $addToSet: { likes: req.user._id } }, // Using $addToSet to prevent duplicates
            { new: true }
        ).populate('postedBy', 'name').exec();
        
        if (!result) {
            return res.status(422).json({ error: "Post not found" });
        }
        
        res.json(result);
    } catch (err) {
        console.error("Error liking post:", err);
        res.status(422).json({ error: err.message });
    }
});

router.put('/unlike', requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate('postedBy', 'name').exec();

        if (!result) {
            return res.status(422).json({ error: "Post not found" });
        }

        res.json(result);
    } catch (err) {
        console.error("Error unliking post:", err);
        res.status(422).json({ error: err.message });
    }
});

router.put('/comment', requireLogin, async (req, res) => {
    const { postId, text } = req.body;

    if (!text) {
        return res.status(422).json({ error: "Please add a comment" });
    }

    const comment = {
        text: text,
        postedBy: req.user._id
    };

    try {
        const result = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: comment } }, // Push the comment object to the comments array
            { new: true }
        ).populate('comments.postedBy', '_id name') // Populate the postedBy field inside comments
        .populate('postedBy', '_id name') // Populate the postedBy field of the post
        .exec();

        if (!result) {
            return res.status(422).json({ error: "Post not found" });
        }

        res.json(result);
    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(422).json({ error: err.message });
    }
});

router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("postedBy", "_id");
        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }
        
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await post.deleteOne();
            res.json({ message: "Post successfully deleted" });
        } else {
            res.status(403).json({ error: "You are not authorized to delete this post" });
        }
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

module.exports = router;
