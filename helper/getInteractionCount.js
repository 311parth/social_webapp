const { interactionModel } = require("../model/interactionModel");
module.exports.getInteraction = async (postID) => {
  console.log(postID,Date.now());
  const result = await interactionModel.findOne({ seq: postID }).clone().exec();
  if (result) {
    return {
      like: result.like,
      dislike: result.dislike,
      seq: result.seq,
      liked_uname: result.liked_uname,
      disliked_uname: result.disliked_uname,
      success: 1,
    };
  } else {
    return {
      success: 0,
    };
  }
};
