const express = require("express");
const { loginModel } = require("../model/loginModel");
let router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = 10;
const loginDetailsServices = require("../services/loginDetailsServices")

router.route("/").post(async (req, res) => {
  var loginUname = req.body.loginUname;
  var loginPw = req.body.loginPassword;

  // console.log(loginUname, loginPw);

  const loginDetails = await loginDetailsServices.findOneByUsername(loginUname)

  if (loginDetails && (await bcrypt.compare(loginPw, loginDetails.pw))) {
    const token = jwt.sign({ uname: loginDetails.uname }, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });
    const verify_jwt = jwt.verify(token, process.env.TOKEN_SECRET);
    // console.log(verify_jwt.uname)
    res
      .cookie("secret", token, {
        // path: "localhost:3000/",
      })
      .cookie("uname", loginUname, {
        // path: "localhost:3000/",
      })
      .json({ logged: 1 });
  } else {
    res.json({ logged: 0 });
  }


  
});

module.exports = router;
