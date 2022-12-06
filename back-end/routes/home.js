const express = require("express");
const authenticateToken = require("../helper/authenticateToken");
let router = express.Router();

router.route("/").get(authenticateToken, (req, res) => {
  res.json({ a: 1 });
});

module.exports = router;
