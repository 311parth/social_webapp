const express = require("express");
let router = express.Router();


// const socketID= require("../server").socketID;
const socketID =require("../server")
router.route("/").get((req,res)=>{
    console.log("o")
    const io = req.io;
    // io.on("connection",(socket)=>{
    //     console.log("hehe")
    //     console.log(socket.id)
    //     io.to(socket.id).emit("hello","world");
    // })

    console.log(socketID);
    io.to(socketID).emit("hello","world");

    res.json({"isok":1});
})

module.exports = router;
