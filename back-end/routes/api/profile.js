const express = require("express");
const authenticateToken = require("../../helper/authenticateToken");
const {postModel} = require("../../model/postModel")
let router = express.Router();
const getLoggedUserData = require("../../helper/getLoggedUserData");


router.route("/post/:username")
  .get(authenticateToken,async (req,res)=>{
    try {
      await postModel
        .find({ uname: req.params.username }, { _id: 0, time: 0, __v: 0 })
        .sort({ seq: -1 })
        .limit(20)
        .clone()
        .exec(async (err, result) => {
          if (err) {
            res.sendStatus(500);
            return;
          }
          if (result) {
            await res.send(result);
          } else {
            return res.status("404").json({ err });
          }
        });
      // res.json({"isok":1})
      
    } catch (error) {
      console.log(error)
    }
  })

router.route("/:username/following")
.get(authenticateToken,async(req,res)=>{
  try {
    getLoggedUserData(req.params.username).then((result)=>{
      if(result[0]){
      res.json(result[0].following)
      }
    })
  } catch (error) {
    console.log(error)
  }
})
  

  
module.exports = router;
