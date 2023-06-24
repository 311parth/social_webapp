const express = require("express");
let router = express.Router();
const getLoggedUserData = require("../../helper/getLoggedUserData");


router.route("/followers/").get(async(req,res)=>{
    try {
      const username = req.query.username
      getLoggedUserData(username).then((result)=>{
        console.log(result)
        if(result[0]){
          res.json(result[0].followers)
        }
        else{
          res.json([]);
        }
      })
        
    } catch (error) {
      console.log(error)
    }
  })
  
  
module.exports = router;
