const mongoose = require("mongoose")
const commentSchema = new mongoose.Schema({
    seq : Number,
    comment : [{
        username: String,
        comment:String
    }]
})

var commentModel = mongoose.model("comments",commentSchema)

module.exports = {
    commentModel : commentModel
}