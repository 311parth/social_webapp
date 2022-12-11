const express = require("express");
let router = express.Router();

const getLoggedUser = require("../helper/getLoggedUser");
const getLoggedUserData = require("../helper/getLoggedUserData");
const authenticateToken = require("../helper/authenticateToken");

const { postModel } = require("../model/postModel");
const { interactionModel } = require("../model/interactionModel");
const { followersModel } = require("../model/followersModel");
const { route } = require("./home");

var seq = 0;
//this will only run when server is restarted , to get last seq number
postModel
  .findOne({}, (err, result) => {
    if (result) {
      seq = result.seq;
    }
  })
  .sort({ seq: -1 });
// console.log(seq);
router.route("/").get((req, res) => {
  res.send("jjj");
});
router.route("/get_username").get((req, res) => {
  const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
  // console.log(username)
  res.json({ username: `${username}` });
});
router
  .route("/post")
  .post(authenticateToken, async (req, res) => {
    var uname = req.body.postUname;
    var title = req.body.postTitle;
    var desc = req.body.postDesc;
    var time = req.body.postTime;

    seq++;
    const new_post = await new postModel({
      uname: uname,
      title: title,
      desc: desc,
      time: time,
      seq: seq,
    }).save();
    const new_interaction = await new interactionModel({
      seq: seq,
      dislike: 0,
      like: 0,
    }).save();
    res.json({ posted: 1 });
  })
  .get(authenticateToken, async (req, res) => {
    
    const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
    const loggedUserData = await getLoggedUserData(username);
    // console.log(loggedUserData)
    var followingUsers = loggedUserData[0].following;
    await postModel
      .find({ uname: { $in: followingUsers } }, { _id: 0, time: 0, __v: 0 })
      .sort({ seq: -1 })
      .limit(20)
      .clone()
      .exec(async (err, result) => {
        if (err) {
          res.sendStatus(500);
          return;
        }
        if (result) {
          await res.send(result);
        } else {
          return res.status("404").json({ err });
        }
      });
  });

router.route("/interaction/:id").get(authenticateToken, async (req, res) => {
  const username = getLoggedUser(req.cookies.secret, req.cookies.uname);

  const seq = req.params.id;
  interactionModel.findOne({ seq: seq }, async (err, result) => {
    if (err) throw err;
    if (result) {
      res.json({
        like: result.like,
        dislike: result.dislike,
        seq: result.seq,
        liked_uname: result.liked_uname,
        disliked_uname: result.disliked_uname,
      });
    } else res.json({ isok: 0 });
  });
});
router
  .route("/interaction/:type")
  .patch(authenticateToken, async (req, res) => {
    //type: like or dislike

    const seq = req.body.seq;
    const fill = req.body.fill;
    const typeOfInteraction = req.params.type;
    var interaction;
    var updated_interaction;
    const username = getLoggedUser(req.cookies.secret, req.cookies.uname);

    //fetching interaction data of post
    await interactionModel
      .findOne({ seq: seq }, async (err, result) => {
        if (err) throw err;
        if (result) {
          if (typeOfInteraction === "like") interaction = result.like;
          else if (typeOfInteraction === "dislike")
            interaction = result.dislike;
        }
      })
      .clone();

    //checking if user already interacted if yes then again interaction mean like to unlike
    if (fill === 0) updated_interaction = interaction + 1;
    else updated_interaction = interaction - 1;

    //2 division according type of interaction
    if (typeOfInteraction === "like") {
      await interactionModel
        .findOne({ seq: seq }, async (err, result) => {
          if (err) throw err;
          result.like = updated_interaction;

          //checking if username already entered if yes then delete else push into array
          if (result.liked_uname.includes(username)) {
            // console.log(result.liked_uname);
            result.liked_uname = result.liked_uname.filter(
              (item) => item !== username
            );
          } else {
            result.liked_uname.push(username);
          }
          await result.save();
          // console.log(result);
        })
        .clone();
    } else if (typeOfInteraction === "dislike") {
      await interactionModel
        .findOne({ seq: seq }, async (err, result) => {
          if (err) throw err;
          result.dislike = updated_interaction;

          if (result.disliked_uname.includes(username)) {
            result.disliked_uname = result.disliked_uname.filter(
              (item) => item !== username
            );
          } else {
            result.disliked_uname.push(username);
          }
          await result.save();
          console.log(result);
        })
        .clone();
    }
    await res.json({ isok: 1 });
  });
router.route("/follow").post(async (req, res) => {
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
        //it means now user is  following so button text will be following
        res.json({ isok: 1, msg: "Following" });
      } else {
        result.following = result.following.filter(
          (username) => username !== followedUsername
        );
        await result.save().then(() => {
          //it means now user is not following so button text will be follow
          res.json({ isok: 1, msg: "Follow" });
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
});
router.route("/random/followcard/").post(async (req, res) => {
  const username = req.body.username;

  const loggedUserData = await getLoggedUserData(username);

  // console.log(loggedUserData);
  try {
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
  } catch (error) {
    console.log(error);
  }
  // console.log(1,loggedUserData[0].following,typeof(loggedUserData[0].following))
});

router.route("/profile/post/:username")
  .get(authenticateToken,async (req,res)=>{
    await postModel
      .find({ uname: req.params.username }, { _id: 0, time: 0, __v: 0 })
      .sort({ seq: -1 })
      .limit(20)
      .clone()
      .exec(async (err, result) => {
        if (err) {
          res.sendStatus(500);
          return;
        }
        if (result) {
          await res.send(result);
        } else {
          return res.status("404").json({ err });
        }
      });
    // res.json({"isok":1})
  })

router.route("/profile/:username/following")
.get(async(req,res)=>{
    getLoggedUserData(req.params.username).then((result)=>{
      res.json(result[0].following)
    })
})

module.exports = router;
