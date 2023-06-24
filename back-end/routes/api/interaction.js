const express = require("express");
const authenticateToken = require("../../helper/authenticateToken");
const {interactionModel} = require("../../model/interactionModel")
const getLoggedUser = require("../../helper/getLoggedUser");

let router = express.Router();

router.route("/:id").get(authenticateToken, async (req, res) => {
    // console.log("interaction get req got ",req.params.id)
    // console.log(req.params.id," => ",new Date().toUTCString());
    try {
      const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
      const seq = req.params.id;
      interactionModel.findOne({ seq: seq }, async (err, result) => {
        if (err) throw err;
        if (result) {
          res.json({
            like: result.like,
            dislike: result.dislike,
            seq: result.seq,
            liked_uname: result.liked_uname,
            disliked_uname: result.disliked_uname,
          });
        } else res.json({ isok: 0 });
      });
        
    } catch (error) {
      console.log(error)
    }
  });
  router
    .route("/:type")
    .patch(authenticateToken, async (req, res) => {
      try {
        //type: like or dislike
        const seq = req.body.seq;
        // const fill = req.body.fill;
        const likeflag = req.body.likeflag;//flag 0 -> not-liked , 1->liked already
        const dislikeflag = req.body.dislikeflag;
        const typeOfInteraction = req.params.type;
        var updated_interaction = {
          likes: 0,
          dislikes: 0,
          likeflag : -1,//-1 means unchanged
          dislikeflag :-1
        };
        const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
        // console.log(req.body)
    
        //2 division according type of interaction
        if (typeOfInteraction === "like") {
          await interactionModel
            .findOne({ seq: seq }, async (err, result) => {
              if (err) throw err;
              if(!likeflag){//if like flag is 0 then add like else remove like
                result.like = result.like+1;
                result.liked_uname.push(username);
                updated_interaction.likeflag = 1;//changing flag
              }else{
                result.like = result.like-1;
                result.liked_uname = result.liked_uname.filter(
                  (item) => item !== username
                );
                updated_interaction.likeflag = 0;//changing flag
              }
              if(dislikeflag){//if dislikeflag 1 then remove dislike count beacuse both not allowed
                result.dislike = result.dislike -1;
                result.disliked_uname = result.disliked_uname.filter(
                  (item) => item !== username
                );
                updated_interaction.dislikeflag = 0;//changing flag
              }
              //updated inteaction
              updated_interaction.likes = result.like,
              updated_interaction.dislikes = result.dislike,
    
              await result.save();
              // console.log(result);
            })
            .clone();
        await res.json({ interactionACK: 1,likes: updated_interaction.likes , dislikes : updated_interaction.dislikes  , likeflag : updated_interaction.likeflag ,dislikeflag : updated_interaction.dislikeflag });
    
        } else if (typeOfInteraction === "dislike") {
          await interactionModel
            .findOne({ seq: seq }, async (err, result) => {
              if (err) throw err;
              if(!dislikeflag){//if dislikeflag flag is 0 then add dislike else remove dislike
                result.dislike = result.dislike +1;
                result.disliked_uname.push(username);
                updated_interaction.dislikeflag = 1;//changing flag
              }else{
                result.dislike = result.dislike -1;
                result.disliked_uname = result.disliked_uname.filter(
                  (item) => item !== username
                );
                updated_interaction.dislikeflag = 0;//changing flag
              }
              if(likeflag){//if likeflag 1 then remove like count beacuse both not allowed
                result.like = result.like-1;
                result.liked_uname = result.liked_uname.filter(
                  (item) => item !== username
                );
                updated_interaction.likeflag = 0;//changing flag
              }
              
              //updated inteaction
              updated_interaction.likes = result.like,
              updated_interaction.dislikes = result.dislike,
    
    
              await result.save();
              // console.log(result);
            })
            .clone();
          await res.json({ interactionACK: 1,likes: updated_interaction.likes,dislikes : updated_interaction.dislikes ,likeflag : updated_interaction.likeflag ,dislikeflag : updated_interaction.dislikeflag });
        }
        // await res.json({ interactionACK: 1 });
        
      } catch (error) {
        console.log(error)
      }
    });
    
  
module.exports = router;
