const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const requireLogin = require('../middleware/requirelogin');

router.get('/user/:id', requireLogin, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name pic ");
        res.json({ user, posts });
        console.log(posts)
    } catch (err) {
        res.status(422).json({ error: "Error fetching data" });
    }
});

router.put('/follow', requireLogin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.body.followID,
            { $push: { followers: req.user._id } },
            { new: true }
        );

        const updatedCurrentUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followID } },
            { new: true }
        );

        res.json(updatedCurrentUser);
    } catch (err) {
        res.status(422).json({ error: "Error updating follow information" });
    }
});

router.put('/unfollow', requireLogin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.body.unfollowID,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        const updatedCurrentUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.unfollowID } },
            { new: true }
        );

        res.json(updatedCurrentUser);
    } catch (err) {
        res.status(422).json({ error: "Error updating unfollow information" });
    }
});

router.put('/updatepic', requireLogin, async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { pic: req.body.pic } },
            { new: true }
        );
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: "Error updating profile picture" });
    }
});

router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}}).then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log
    })
})

module.exports = router;