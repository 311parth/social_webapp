const {followersModel} = require("../model/followersModel")


async function getLoggedUserData(username) {
  let loggedUserData;

  await followersModel
    .find({ username: username }, (err, result) => {
      // console.log(result,typeof(result))
      if (err) throw err;
      if (result) {
        // console.log(2,result);
        // return result;
        loggedUserData = result;
      }
    })
    .clone();
  return loggedUserData;
}

module.exports = getLoggedUserData;
