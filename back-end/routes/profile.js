const express = require("express");
const authenticateToken = require("../helper/authenticateToken");
let router = express.Router();

const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");

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
    // console.log(0.5,Date.now())
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});



async function saveProfileImgToDB(req, res, next) {
    if (req.file) {
      // console.log(req.file);
      sharp.cache(false);


      // console.log(1, Date.now());
      const resize = new Promise((resolve, reject) => {
        sharp(`./uploads/${req.file.filename}`)
          .resize(256, 256)
          .toFile(
            `uploads/${"_resized" + req.file.filename}`,
            function (err, info) {
              if (err) console.log("E", err);
              // console.log(info);
              // console.log(1.5, Date.now());
              resolve(1);
            }
          );
      });

      resize.then(async () => {
        await profileImageModel.deleteOne({username:req.params.uname});
        // console.log(2, Date.now());
        const saveImage = await profileImageModel({
          username: req.params.uname,
          img: {
            data: fs.readFileSync("uploads/" + "_resized" + req.file.filename),
            contentType: "image/png",
          },
        });
        // console.log(3, Date.now());
        saveImage
          .save()
          .then((res) => {
            // console.log("image is saved");
          })
          .catch((err) => {
            console.log(err, "error has occur");
          });
        // console.log(req.body);
        fs.rm("uploads/" + req.file.filename, () => {
          fs.rm("uploads/" + "_resized" + req.file.filename, () => {});
          // console.log(3, Date.now());
          // console.log("stored at db removed at server");
        });
        next();
      });
    }
}

//TODO: add authentication authorization for below route
router
  .route("/profileimg/upload/:uname")
  .post(upload.single("inputProfileImg"), saveProfileImgToDB,async (req, res) => {
    res.json({ isuploaded: 1 });
  });
router.route("/profileImg/:username").get(async (req, res) => {
  await profileImageModel
    .findOne({ username: req.params.username }, async (err, result) => {
      if (err) throw err;
      if (result) {
        // console.log(result.img.contentType,result.username);
        res.contentType(result.img.contentType);
        res.send(result.img.data);
      }
      //if not getting result then return default  image
      else {
        await profileImageModel
          .findOne({ username: "test" }, (err, result) => {
            if (err) throw err;
            if (result) {
              // console.log(result.img.contentType);
              res.contentType(result.img.contentType);
              res.send(result.img.data);
            }
          })
          .clone();
      }
    })
    .clone();
  // res.json({"isok":0})
  // res.json({"isok": req.params.username});
});

module.exports = router;