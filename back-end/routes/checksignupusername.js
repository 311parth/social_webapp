const express = require("express");
let router = express.Router();
const { loginModel } = require("../model/loginModel");


router.route("/").post(async (req, res) => {
  try {
      
    console.log(req.body);
    console.log(req.body.signupUname);
  
    loginModel.findOne({ uname: req.body.signupUname }, (err, result) => {
      if (err) throw err;
      if (result) {
        res.json({ available: 0 });
      } else {
        res.json({ available: 1 });
      }
    });
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
