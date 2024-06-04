const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_Sec} = require('../store')
const requirelogin = require('../middleware/requirelogin')

router.get('/',(req,res)=>{
    res.send("Ki Haal")
})
router.get('/protected',requirelogin,(req,res)=>{
    res.send("Hi") ;
})
router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!email || !name || !password) {
        return res.status(422).json({ error: "Not all info" });
    }

    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "Already exists" });
            }

            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword,
                        pic: pic || "noPhoto"  // Set default picture if none provided
                    });

                    user.save()
                        .then(user => {
                            res.json({ message: "Saved" });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
        })
        .catch(err => {
            console.log(err);
        });
});
    router.post('/signin', (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "Please provide email and password" });
        }
        User.findOne({ email: email }).then(saved => {
            if (!saved) {
                return res.status(404).json({ error: "Invalid credentials" });
            }
            bcrypt.compare(password, saved.password).then(doMatch => {
                if (doMatch) {
                    const token = jwt.sign({ _id: saved._id }, JWT_Sec);
                    res.json({message : "Successfully signed in ",token,saved})
                  //  res.json({ token,saved }); // <-- Return token to the client
                   


                } else {
                    return res.status(404).json({ error: "Invalid credentials" });
                }
            });
        });
    });
    
    

module.exports= router