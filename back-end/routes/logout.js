const express = require("express");

let router = express.Router();
router.route("/").get((req, res) => {
  // console.log("logouting")
  res.clearCookie("secret").clearCookie("uname");
  res.send("logouted ")
  res.end();
  // res.json({ msg: "looged out succesfully" });
});

module.exports = router;
