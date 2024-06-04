const express = require('express')
const app = express() 
const mongoose = require('mongoose')
const port = process.env.port|| 5000 
const  {MONGO} = require('./store')

const middleware = (req,res,next)=>{
    console.log("Yo") 
    next()

}
require('./model/user')
require('./model/post')
mongoose.model("User")
mongoose.model("Post")
app.use(express.json()) // for json to parse incoming request
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
//app.use(middleware)
mongoose.connect(MONGO)
mongoose.connection.on('connected',()=>{
    console.log("Hogya connetc btc")
})
mongoose.connection.on('error',(err)=>{
    console.log("error:",err)
})




app.get('/hey',(req,res)=>{
    res.send("Hi there") 
})



app.listen(port,()=>{
    console.log("f") 
})