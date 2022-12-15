const {followersModel} = require("../model/followersModel")


async function getLoggedUserData(username){
  let loggedUserData = await followersModel.find({username:username});
  // console.log(loggedUserData,Date.now());
  return loggedUserData;
}

module.exports = getLoggedUserData;
