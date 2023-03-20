const express = require("express");
const { loginModel } = require("../model/loginModel");
let router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = 10;


router.route("/").post(async (req, res) => {
  var loginUname = req.body.loginUname;
  var loginPw = req.body.loginPassword;

  // console.log(loginUname, loginPw);
  loginModel.findOne({ uname: loginUname }, async (err, result) => {
    try {
      if (err) throw err;
      if (result && (await bcrypt.compare(loginPw, result.pw))) {
        const token = jwt.sign({ uname: loginUname }, process.env.TOKEN_SECRET, {
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
        // console.log(token);
      } else {
        res.json({ logged: 0 });
      }
      
    } catch (error) {
      console.log(error)
    }
  });

  // res.json({"ishome":1})
});

module.exports = router;
