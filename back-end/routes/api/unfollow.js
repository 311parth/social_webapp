const express = require("express");
const authenticateToken = require("../../helper/authenticateToken");
const {followersModel} = require("../../model/followersModel")
let router = express.Router();

router.route("/").post(async (req, res) => {
    try {
      // console.log(req.body)
      const username = req.body.username;
      const unfollowedUsername = req.body.unfollowedUsername;
      if(!username || !unfollowedUsername || username===unfollowedUsername )res.json({"isok":0});
      // console.log(req.body)
      followersModel.findOne({ username: username }, async (err, result) => {
        if (err) throw err;
        if (result) {
          if (!result.following.includes(unfollowedUsername)) {//when unfollowed button click twice or follow via unfollow api call 
            //adding unfollowed username to following array
            result.following = [...result.following, unfollowedUsername];
            await result.save();
            //adding follower user to followed account 
            followersModel.findOne({username:unfollowedUsername},async (followerErr,followerResult)=>{
              if(followerErr)throw followerErr;
              if(followerResult){
                if(!followerResult.followers.includes(username)){
                  followerResult.followers = [...followerResult.followers,username];
                  await followerResult.save();
                }
              }
            })
            //it means now user is  following so button text will be following
            res.json({ isok: 1, msg: "UnFollow" ,"follow":1});
          } else {//when unfollow button clicked
            result.following = result.following.filter(
              (username) => username !== unfollowedUsername
            );
            await result.save().then(() => {
            
              //removing follower user to unfollowed account 
              followersModel.findOne({username:unfollowedUsername},async(followerErr,followerResult)=>{
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
        }
      });
      // res.json({"isok":0})
        
    } catch (error) {
      console.log(error)
    }
  });
module.exports = router;
