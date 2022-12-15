const express = require("express");
const authenticateToken = require("../helper/authenticateToken");
let router = express.Router();

const getLoggedUser = require("../helper/getLoggedUser")

const {postModel} = require("../model/postModel");
const getLoggedUserData = require("../helper/getLoggedUserData");
const postAuthentication = async(req,res,next)=>{
    const username  = await getLoggedUser(req.cookies.secret,req.cookies.uname)

    await getLoggedUserData(username).then((result)=>{
        
        // console.log("r",result)
        if(result && result[0].following.includes(req.params.username) || req.params.username===username){
            next();
        }
        else{
            // console.log("here")
            res.sendStatus(401);
        }
    })

}
router.route("/image/post/:username/:seq").get(authenticateToken,postAuthentication,async(req, res) => {
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
//   res.json({ username: req.params.username});
});

module.exports = router;
