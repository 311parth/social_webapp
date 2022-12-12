const express = require("express");
const {loginModel} = require("../model/loginModel");
const {followersModel} = require("../model/followersModel");

let router = express.Router();

const bcrypt = require("bcrypt");
const salt = 10;

router.route("/").post(async(req, res) => {

  var signupName = req.body.signupName;
  var signupUname = req.body.signupUname;
  var signupPw = req.body.signupPassword;

  const hashedPw = await bcrypt.hash(signupPw, salt);

  // console.log(signupName, signupUname, hashedPw);

  await loginModel.findOne({ uname: signupUname }, async (err, result) => {
    if (err) return err;
    if (result) {
      res.json({ available: 0 });
    } else {
       let new_user = new loginModel({
        uname: signupUname,
        pw: hashedPw,
        name: signupName,
      }).save();
      let new_user_followers = new followersModel({
        username: signupName,
        following : [],
        folloers : []
      }).save();
      res.json({"isok":1,
      "uname" : signupUname
    });
    }


  }).clone();
});

module.exports = router;
