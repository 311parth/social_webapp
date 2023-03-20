const {followersModel} = require("../model/followersModel")


async function getLoggedUserData(username){
  // console.log(1,username,new Date().toLocaleTimeString());

  let loggedUserData = await followersModel.find({username:username});
  // console.log(2,username,loggedUserData,new Date().toLocaleTimeString());
  return loggedUserData;
}

module.exports = getLoggedUserData;
