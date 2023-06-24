const express = require("express");
let router = express.Router();

const getLoggedUser = require("../helper/getLoggedUser");
const getLoggedUserData = require("../helper/getLoggedUserData");
const authenticateToken = require("../helper/authenticateToken");

const { postModel } = require("../model/postModel");
const { followersModel } = require("../model/followersModel");


router.route("/").get((req, res) => {
  res.send("jjj");
});
router.route("/get_username").get(authenticateToken,(req, res) => {
  try {
    const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
    // console.log(username)
    res.json({ username: `${username}` });
      
  } catch (error) {
    console.log(error)
  }
});


router.route("/isfollowing").post(async (req,res)=>{
  try {
    const username=req.body.username;
    const isfollowUsername=req.body.isfollowUsername;
    await followersModel.findOne({username:username},(err,result)=>{
      if(err)throw err;
      if(result){
        // console.log(result);  
        if(result.following.includes(isfollowUsername))
          res.json({"isfollowing":1})
        else res.json({"isfollowing":0})
      }
    }).clone()
  } catch (error) {
    console.log(error)
  }
})

router.route("/get_following").post(async(req,res)=>{
  try {
    // const username=req.body.username;
    const username = getLoggedUser(req.cookies.secret,req.cookies.uname);
    // console.log(username)
      await followersModel.findOne({username:username},(err,result)=>{
          if(err)throw err;
          if(result){
            // console.log(result.following);
            res.json(result.following);
            // res.json({"isok":1})
          }else{
            res.json({"isok":0});
          }
      }).clone();
  } catch (error) {
    console.log(error)
  }
  
})

router.route("/random/followcard/").post(async (req, res) => {
  try {
    const username = req.body.username;
    // const loggedUserData = await getLoggedUserData(username);
    getLoggedUserData(username).then(async(loggedUserDataResult)=>{
    const loggedUserData = loggedUserDataResult;
      try {
        if(loggedUserData[0]){
          loggedUserData[0].following.push(username); //temporary addding username to remove it from list of all unfollowing user
          await followersModel
            .find(
              {
                username: { $nin: loggedUserData[0].following },
              },
              { username: 1, _id: 0 }
            )
            .clone()
            .limit(50)
            .exec((err, result) => {
              var array = [];
              if (err) throw err;
              else {
                for (const i in result) {
                  array.push(result[i].username);
                }
                res.json({ isok: 1, usernameArray: array });
              }
            });
        }
        else{
          res.json({isok:1})
        }
      } catch (error) {
        console.log(error);
      }
    })
  
    // console.log(loggedUserData);
    // console.log(1,loggedUserData[0].following,typeof(loggedUserData[0].following))
      
  } catch (error) {
    console.log(error)
  }
});






module.exports = router;
