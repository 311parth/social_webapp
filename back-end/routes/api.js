const express = require("express");
let router = express.Router();

const getLoggedUser = require("../helper/getLoggedUser");
const getLoggedUserData = require("../helper/getLoggedUserData");
const authenticateToken = require("../helper/authenticateToken");

const { postModel } = require("../model/postModel");
const { interactionModel } = require("../model/interactionModel");
const { followersModel } = require("../model/followersModel");
const {commentModel} = require("../model/commentModel")

const { route } = require("./home");
const fs = require("fs");


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
router.route("/get_username").get(authenticateToken,(req, res) => {
  const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
  // console.log(username)
  res.json({ username: `${username}` });
});


const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb stands for call back that auto call by multer
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // console.log("here",file.originalname)

  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
    // console.log(0.5,Date.now())
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

async function savePostImgToDB(req, res, next) {
    var uname = req.body.postUname;
    var title = req.body.postTitle;
    var desc = req.body.postDesc;
    var time = req.body.postTime;

  seq++;
  if (req.files) {
    // console.log("req.file if")
    //req.files name is complicated as below
    const fileOriginalName = req.files.inputPostImg[0].originalname

    // console.log(req.files);

      const saveImage = await postModel({
        uname: uname,
        title: title,
        desc: desc,
        time: time,
        seq: seq,
        img: {
          data: fs.readFileSync("uploads/" + fileOriginalName),
          contentType: "image/jpeg",
          name:fileOriginalName
        },
      });
      saveImage
        .save()
        .then((res) => {
          // console.log("image is saved");
        })
        .catch((err) => {
          console.log(err, "error has occur");
        });
      //console.log(req.body);
      fs.rm("uploads/" +fileOriginalName, () => {
        // console.log(3, Date.now());
        // console.log("stored at db removed at server");
      });

  }
  else{
    // console.log("req.file else")
    const saveImage = await postModel({
      uname: uname,
      title: title,
      desc: desc,
      time: time,
      seq: seq,
    })
    saveImage.save().then((saved)=>{
      // console.log("post image saved");
    }).catch((err)=>{
      console.log(err);
    })
  }
  next();
}

router
  .route("/post")
  .post(authenticateToken,upload.fields([
    { name: "otherFormData", maxCount: 1 },
    { name: "inputPostImg", maxCount: 1 }
  ]),savePostImgToDB,async (req, res) => {

    //to get the file name => by doing console.log(req.files) its is nested in objects like below
    // console.log("file",req.files.inputPostImg[0].originalname);


    //saving  blank interaction for above post
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
    console.log("post req for homepage feed",username," => ",new Date().toUTCString());

    // console.log(loggedUserData)
    if( loggedUserData[0]){
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
    }
    else{
      return res.json([])
    }
  });

  router.route("/post/latest/:username").get(authenticateToken,(req,res)=>{
    const username = getLoggedUser(req.cookies.secret, req.cookies.uname);

    let loggedUserData ;

     getLoggedUserData(username).then((result)=>{
        
      if(result && result[0].following){
        if(result[0].following.includes(req.params.username)){
          postModel
          .find({ uname: { $in: req.params.username } }, { _id: 0, time: 0, __v: 0 })
          .sort({ seq: -1 })
          .limit(5)
          .clone()
          .exec(async (err, result) => {
            if (err) {
              res.sendStatus(500);
              return;
            }
            if (result) {
              res.send(result);
            } else {
              return res.status("404").json({ err });
            }
        });

        }else{
          res.json({});
        }
      }
      else{
          // console.log("here")
          res.sendStatus(401);
      }
  })
  })


router.route("/interaction/:id").get(authenticateToken, async (req, res) => {
  // console.log("interaction get req got ",req.params.id)
  // console.log(req.params.id," => ",new Date().toUTCString());

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
          // console.log(result);
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
});
router.route("/random/followcard/").post(async (req, res) => {
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
.get(authenticateToken,async(req,res)=>{
    getLoggedUserData(req.params.username).then((result)=>{
      if(result[0]){
      res.json(result[0].following)
      }
    })
})

router.route("/user").get(async(req,res)=>{
  const username = req.query.username
  getLoggedUserData(username).then((result)=>{
    // console.log(result)
    if(result[0]){
      res.json(result[0].followers)
    }
    else{
      res.json([]);
    }
  })
})


router.route("/post/comment/:seq").get(authenticateToken,async(req,res)=>{
  // console.log("comment get req got",req.params.seq)

  commentModel.findOne({seq:req.params.seq},{"comment._id":0},async(err,result)=>{
    if(err)throw err;
    if(result){
      res.json(result.comment)
    }else{
      res.json("");
    }
  })
})
.post(authenticateToken,async(req,res)=>{
  const username = getLoggedUser(req.cookies.secret,req.cookies.uname)
  // console.log("comment post req got",req.params.seq)
  // var newComment = await  new commentModel({
  //   seq : req.params.seq,
  //   username : username,
  //   comment : req.body.comment
  // }).save();
 
  commentModel.findOne({seq:req.params.seq},async(err,result)=>{
    if(err)throw err;
    if(result){
      // console.log("it means that comment document is created for this seq number")
      //it means that comment document is created for this seq number
      result.comment = [...result.comment,{
        //appending new comment to array of comments for this seq 
        username : username,
        comment : req.body.comment
      }];
      await result.save();
    }else{
      //creating  comment document for this seq number 
      const newComment = await commentModel({
        seq: req.params.seq,
        comment : [{
          username: username,
          comment : req.body.comment
        }]
      }).save();
    }
  })
  res.json({"isok":1})
})


module.exports = router;
