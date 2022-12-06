const express = require("express");

let router = express.Router();
router.route("/").post((req, res) => {
  res.clearCookie("secret").clearCookie("uname");
  res.json({ msg: "looged out succesfully" });
});

module.exports = router;
