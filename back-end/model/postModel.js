const mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
    uname: String,
    title:String,
    desc:String,
    time : Date,
    seq : Number,
    img: {
        data: Buffer,
        contentType: String,
        name:String
    }
})

var postModel = mongoose.model("posts",postSchema)

module.exports = {
    postModel : postModel
}