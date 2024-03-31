const express = require("express");
const authenticateToken = require("../helper/authenticateToken");
let router = express.Router();
//test route 
router.route("/").get(authenticateToken, (req, res) => {
  res.json({ a: 1 });
});

module.exports = router;
