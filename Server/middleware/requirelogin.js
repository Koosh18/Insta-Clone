const jwt = require('jsonwebtoken');
const { JWT_Sec } = require('../store');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    //console.log(req.headers)
    if (!authorization) {
        console.log("f") ;
        return res.status(401).json({ Error: "Login required" });
    }
    const token = authorization.replace("Bearer ", "").trim(); // Trim whitespace
    jwt.verify(token, JWT_Sec, (err, payload) => {
        if (err) {
           // console.log(token)
          //  console.log(jwt)
            return res.status(401).json({ Error: "Unauthorized" }); // Send appropriate error message
        }
        console.log("h") ;
        console.log(payload)
        const { _id } = payload;
        User.findById(_id).then(userdata => {
            if (!userdata) {
                return res.status(404).json({ Error: "User not found" });
            }
            req.user = userdata;
            next();
        }).catch(err => {
            console.error("Error finding user:", err);
            return res.status(500).json({ Error: "Server error" }); // Handle database error
        });
    });
};
