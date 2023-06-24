const express = require("express");
const authenticateToken = require("../../helper/authenticateToken");
const {followersModel} = require("../../model/followersModel")
let router = express.Router();

router.route("/").post(async (req, res) => {
    try {
        const username = req.body.username;
        const followedUsername = req.body.followedUsername;
      // console.log(req.body)
      followersModel.findOne({ username: username }, async (err, result) => {
        if (err) throw err;
        if (result) {
          if (!result.following.includes(followedUsername)) {
            //adding followed username to following array
            result.following = [...result.following, followedUsername];
            await result.save();
            //adding follower user to followed account 
            followersModel.findOne({username:followedUsername},async (followerErr,followerResult)=>{
              if(followerErr)throw followerErr;
              if(followerResult){
                if(!followerResult.followers.includes(username)){
                  followerResult.followers = [...followerResult.followers,username];
                  await followerResult.save();
                }
                
              }
            })
            //it means now user is  following so button text will be following
            res.json({ isok: 1, msg: "Following" ,"follow":1});
          } else {
            result.following = result.following.filter(
              (username) => username !== followedUsername
            );
            await result.save().then(() => {
    
              followersModel.findOne({username:followedUsername},async(followerErr,followerResult)=>{
                if(followerErr)throw followerErr;
                if(followerResult){
                  followerResult.followers = followerResult.followers.filter(
                    (followingUsername)=>followingUsername!== username
                  )
                  await followerResult.save();
                }
              })
              //it means now user is not following so button text will be follow
              res.json({ isok: 1, msg: "Follow" ,"follow":0});
            });
          }
          // console.log(result);
        } else {
          //creating new user entry if username not found in db
          const new_user = await new followersModel({
            username: username,
            following: [followedUsername],
          })
            .save()
            .then(() => {
              res.json({ isok: 1, msg: "Following" });
            });
        }
      });
      // res.json({"isok":0})
        
    } catch (error) {
      console.log(error)
    }
  });
  
module.exports = router;
