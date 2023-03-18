const express = require("express");

let router = express.Router();
router.route("/").get((req, res) => {
  try {
    // console.log("logouting")
    res.clearCookie("secret").clearCookie("uname");
    res.send("logouted ")
    res.end();
    // res.json({ msg: "looged out succesfully" });
      
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
