const mongoose = require("mongoose")
const profileImageSchema = new mongoose.Schema({
    username: String,
    img: {
        data: Buffer,
        contentType: String,
    },
})

var profileImageModel = mongoose.model("profileImage",profileImageSchema)

module.exports = {
    profileImageModel : profileImageModel
}