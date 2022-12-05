const mongoose = require("mongoose")
const followersSchema = new mongoose.Schema({
    // seq : Number,
    // like:Number,
    // dislike:Number,
    // liked_uname: [String],
    // disliked_uname: [String],
    username : String,
    following : [String]
})

var followersModel = mongoose.model("followers",followersSchema)

module.exports = {
    followersModel : followersModel
}