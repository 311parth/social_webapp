const mongoose = require("mongoose")
const loginSchema = new mongoose.Schema({
    uname: String,
    pw : String,
    name: String,
})

var loginModel = mongoose.model("loginmodels",loginSchema)

module.exports = {
    loginModel : loginModel
}