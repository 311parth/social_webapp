const express = require("express");
const authenticateToken = require("../../helper/authenticateToken");
const { interactionModel } = require("../../model/interactionModel");
const getLoggedUser = require("../../helper/getLoggedUser");

const router = express.Router();

router.route("/:id").get(authenticateToken, getInteraction);
router.route("/:type").patch(authenticateToken, updateInteraction);

async function getInteraction(req, res) {
  try {
    const { id } = req.params;
    const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
    const result = await findInteraction(id);
    
    if (result) {
      res.json({
        like: result.like,
        dislike: result.dislike,
        seq: result.seq,
        liked_uname: result.liked_uname,
        disliked_uname: result.disliked_uname,
      });
    } else {
      res.json({ isok: 0 });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateInteraction(req, res) {
  try {
    const { type } = req.params;
    const { seq, likeflag, dislikeflag } = req.body;
    const username = getLoggedUser(req.cookies.secret, req.cookies.uname);
    const updatedInteraction = await updateInteractionData(type, seq, likeflag, dislikeflag, username);
    
    res.json(updatedInteraction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function findInteraction(seq) {
  return await interactionModel.findOne({ seq });
}

async function updateInteractionData(type, seq, likeflag, dislikeflag, username) {
  const result = await findInteraction(seq);
  const updatedInteraction = { likes: 0, dislikes: 0, likeflag: -1, dislikeflag: -1 };
  
  if (type === "like") {
    if (!likeflag) {
      result.like++;
      result.liked_uname.push(username);
      updatedInteraction.likeflag = 1;
    } else {
      result.like--;
      result.liked_uname = result.liked_uname.filter((item) => item !== username);
      updatedInteraction.likeflag = 0;
    }
    if (dislikeflag) {
      result.dislike--;
      result.disliked_uname = result.disliked_uname.filter((item) => item !== username);
      updatedInteraction.dislikeflag = 0;
    }
  } else if (type === "dislike") {
    if (!dislikeflag) {
      result.dislike++;
      result.disliked_uname.push(username);
      updatedInteraction.dislikeflag = 1;
    } else {
      result.dislike--;
      result.disliked_uname = result.disliked_uname.filter((item) => item !== username);
      updatedInteraction.dislikeflag = 0;
    }
    if (likeflag) {
      result.like--;
      result.liked_uname = result.liked_uname.filter((item) => item !== username);
      updatedInteraction.likeflag = 0;
    }
  }
  
  updatedInteraction.likes = result.like;
  updatedInteraction.dislikes = result.dislike;
  await result.save();
  
  return { interactionACK: 1, likes: updatedInteraction.likes, dislikes: updatedInteraction.dislikes, likeflag: updatedInteraction.likeflag, dislikeflag: updatedInteraction.dislikeflag };
}

module.exports = router;
