const express = require("express");
const authenticateToken = require("../../helper/authenticateToken");
const {followersModel} = require("../../model/followersModel")
let router = express.Router();

router.route("/").post(handleFollowUnfollow);

async function handleFollowUnfollow(req, res) {
  try {
    // Extract username and unfollowedUsername from request body
    const { username, unfollowedUsername } = req.body;
    
    // Check if either username or unfollowedUsername is missing, or they are the same
    if (!username || !unfollowedUsername || username === unfollowedUsername) {
      return res.json({ "isok": 0 });
    }
    
    // Find user with the given username
    const result = await findUser(username);
    
    if (result) {
      // If the user is not already following the unfollowed user
      if (!result.following.includes(unfollowedUsername)) {
        // Follow the unfollowed user
        await followUser(username, unfollowedUsername);
        // Update followers of the unfollowed user
        await updateFollowers(unfollowedUsername, username);
        // Respond indicating the user is now following
        return res.json({ isok: 1, msg: "UnFollow", "follow": 1 });
      } else {
        // If the user is already following the unfollowed user
        // Unfollow the unfollowed user
        await unfollowUser(result, unfollowedUsername);
        // Remove follower from the unfollowed user
        await removeFollower(unfollowedUsername, username);
        // Respond indicating the user is now not following
        return res.json({ isok: 1, msg: "Follow", "follow": 0 });
      }
    }
  } catch (error) {
    // Handle any errors occurred during the process
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to find a user by username
async function findUser(username) {
  return await followersModel.findOne({ username });
}

// Function to follow a user
async function followUser(username, unfollowedUsername) {
  const result = await followersModel.findOne({ username });
  result.following = [...result.following, unfollowedUsername];
  await result.save();
}

// Function to update followers of a user
async function updateFollowers(unfollowedUsername, username) {
  const followerResult = await followersModel.findOne({ username: unfollowedUsername });
  if (!followerResult.followers.includes(username)) {
    followerResult.followers = [...followerResult.followers, username];
    await followerResult.save();
  }
}

// Function to unfollow a user
async function unfollowUser(result, unfollowedUsername) {
  result.following = result.following.filter((username) => username !== unfollowedUsername);
  await result.save();
}

// Function to remove a follower from a user
async function removeFollower(unfollowedUsername, username) {
  const followerResult = await followersModel.findOne({ username: unfollowedUsername });
  followerResult.followers = followerResult.followers.filter((followingUsername) => followingUsername !== username);
  await followerResult.save();
}

module.exports = router;
