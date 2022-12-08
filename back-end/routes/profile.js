const express = require("express");
const authenticateToken = require("../helper/authenticateToken");
let router = express.Router();
const multer = require("multer");
const fs = require("fs");

const { profileImageModel } = require("../model/profileImageModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb stands for call back that auto call by multer
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

function saveProfileImgToDB(req,res,next) {
  if(req.file){
  const saveImage = profileImageModel({
    username: req.params.uname,
    img: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: "image/png",
    },
  });
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
  console.log(req.body);
  fs.rm("uploads/" + req.file.filename, () => {
    console.log("stored at db removed at server");
  });
}
next();
}

//TODO: add authentication authorization for below route
router.route("/profileimg/upload/:uname").post(upload.single("inputProfileImg"), saveProfileImgToDB,(req, res) => {
  res.json({ "isuploaded": 1 });
});

router.route("/profileImg/:username").get(async(req,res)=>{
    await profileImageModel.findOne({username : req.params.username},(err,result)=>{
      if(err) throw err;
      if(result){
        console.log(result.img.contentType);
        res.contentType(result.img.contentType)
        res.send(result.img.data)
      }
    }).clone()
    // res.json({"isok":0})
  // res.json({"isok": req.params.username});
})

module.exports = router;
