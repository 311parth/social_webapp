const mongoose = require("mongoose")
const interactionSchema = new mongoose.Schema({
    seq : Number,
    like:Number,
    dislike:Number,
    liked_uname: [String],
    disliked_uname: [String],
    
})

var interactionModel = mongoose.model("interaction",interactionSchema)

module.exports = {
    interactionModel : interactionModel
}