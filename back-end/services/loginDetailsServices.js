const { loginModel } = require("../model/loginModel");

async function findOneByUsername(username){
    try {
        const loginDetails = await loginModel.findOne({uname:username});
        return loginDetails;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    findOneByUsername,
}