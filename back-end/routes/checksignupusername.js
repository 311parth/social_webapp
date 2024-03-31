const express = require("express");
let router = express.Router();
const loginDetailsServices = require("../services/loginDetailsServices");

router.route("/").post(async (req, res) => {
  try {
    const reqUsername = req.body.signupUname;
    const loginDetails = await loginDetailsServices.findOneByUsername(reqUsername)
    if(loginDetails){
        res.json({ available: 0 });
    }else{
      res.json({available:1});
    }
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
