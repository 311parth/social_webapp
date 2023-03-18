const express = require("express");
const authenticateToken = require("../helper/authenticateToken");
let router = express.Router();

const getLoggedUser = require("../helper/getLoggedUser")

const {postModel} = require("../model/postModel");
const getLoggedUserData = require("../helper/getLoggedUserData");
const postAuthentication = async(req,res,next)=>{
    try {
        
        const username  = await getLoggedUser(req.cookies.secret,req.cookies.uname)
        console.log("u",username,typeof(username));
       await getLoggedUserData(username).then((result)=>{
            console.log("r",username,typeof(username),result)
            if(result && result[0] && result[0].following  && result[0].following.includes(req.params.username) || req.params.username===username){
                next();
            }
            else{
                // console.log("here")
                res.sendStatus(401);
            }
        })
    } catch (error) {
        console.log(error);
    }

}
router.route("/image/post/:username/:seq").get(async(req, res) => {
    
    //add postAuthentication middleware  if only follwers can access any post 
    try {   
        await postModel.findOne({seq:req.params.seq},async(err,result)=>{
            if(err)throw err;
            if(result && result.img && result.img.contentType){//here must have to check result.img.contentType
                    // console.log(result.img.name)
                    res.contentType(result.img.contentType);
                    res.send(result.img.data);
            }else{
                res.sendStatus(404);
            }
        }).clone()
    } catch (error) {
        console.log(error);
    }
//   res.json({ username: req.params.username});
});

module.exports = router;
