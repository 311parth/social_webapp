const express = require("express");
const authenticateToken = require("../../helper/authenticateToken");
const {postModel} = require("../../model/postModel")
const {interactionModel} = require("../../model/interactionModel")
const {commentModel} = require("../../model/commentModel")
const getLoggedUser = require("../../helper/getLoggedUser");
const getLoggedUserData = require("../../helper/getLoggedUserData");

let router = express.Router();
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
    try {
      
    
      var uname = req.body.postUname;
      var title = req.body.postTitle;
      var desc = req.body.postDesc;
      var time = req.body.postTime;
  
    seq++;
    if (req.files && req.files.inputPostImg && req.files.inputPostImg[0]) {
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
    } catch (error) {
      console.log(error);
    }
  }
router
  .route("/")
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
    // console.log(req.query);
    try {

      var lastSeq = req.query.seq;
      if(req.query.seq<0)lastSeq=Number.MAX_SAFE_INTEGER;
      const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
      const loggedUserData = await getLoggedUserData(username);
      // console.log("post req for homepage feed",username," => ",new Date().toUTCString());
        
        if( loggedUserData[0]){
          var followingUsers = loggedUserData[0].following;
          await postModel
            .find({ uname: { $in: followingUsers },seq:{$lt : lastSeq} }, { _id: 0, time: 0, __v: 0 })
            .sort({ seq: -1 })
            .limit(8)
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
      // console.log(loggedUserData)
      
    } catch (error) {
      console.log(error)
    }
  });

  router.route("/latest/:username").get(authenticateToken,(req,res)=>{
    try {
      const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
  
      let loggedUserData ;
  
       getLoggedUserData(username).then((result)=>{
          
        if(result && result[0].following){
          if(result[0].following.includes(req.params.username)){
            postModel
            .find({ uname: { $in: req.params.username } }, { _id: 0, time: 0, __v: 0 ,img : 0})
            .sort({ seq: -1 })
            .limit(3)
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
      
    } catch (error) {
      console.log(error)
    }
  })

  
router.route("/comment/:seq").get(authenticateToken,async(req,res)=>{
  try {
  // console.log("comment get req got",req.params.seq)

    commentModel.findOne({seq:req.params.seq},{"comment._id":0},async(err,result)=>{
      if(err)throw err;
      if(result){
        res.json(result.comment)
      }else{
        res.json("");
      }
    })
      
  } catch (error) {
    console.log(error)
  }

})
.post(authenticateToken,async(req,res)=>{
  try {
    const username = getLoggedUser(req.cookies.secret,req.cookies.uname)
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
    res.json({"isPosted":1})
      
  } catch (error) {
    console.log(error)
  }
})



  
module.exports = router;
