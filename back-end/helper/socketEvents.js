const {getInteraction}=require("./getInteractionCount")

const socketEvents=()=>{
    var{io} = require("../server")
    io.on("connection",(socket)=>{
        console.log(socket.id)
        io.to(socket.id).emit("hello","world");
        socket.on("reqInteraction",async(postID)=>{
            var res =await getInteraction(postID);
            io.to(socket.id).emit("resInteraction",res);
        })
    })
}





module.exports = socketEvents;