const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.use(bodyParser.json())

const path = require("path")

var cookieParser = require("cookie-parser");
app.use(cookieParser());

const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcrypt");
const salt = 10;

const jwt = require("jsonwebtoken");

const { conn } = require("./db/db");

const { loginModel } = require("./model/loginModel");
const {postModel} = require("./model/postModel")

const {interactionModel} = require("./model/interactionModel")

var cors = require("cors");
app.use(cors());    

const session = require("express-session");


app.use(express.static(__dirname+"../front-end/build"))

app.get("/", (req, res) => {
  res.send("he");
});



 

app.post("/checksignupusername",(req,res)=>{
    console.log(req.body)
    console.log(req.body.signupUname)

    loginModel.findOne({uname:req.body.signupUname},(err,result)=>{
        if (err) throw err;
        if(result){
            res.json({"available":0})
        }
        else{
            res.json({"available":1})
        }
    })
})

function islogged(req,res,next) {
  next();
}

app.get("/home",islogged,(req,res)=>{
  res.json({"a":1});
})

app.post("/login", (req, res) => {
  var loginUname = req.body.loginUname;
  var loginPw = req.body.loginPassword;

  // console.log(loginUname, loginPw);
  loginModel.findOne({ uname: loginUname }, async (err, result) => {
    if (err) throw err;
    if (result && (await bcrypt.compare(loginPw, result.pw))) {
      const token = jwt.sign({ uname: loginUname }, process.env.TOKEN_SECRET, {
        expiresIn:"7d",
      });
      const verify_jwt = jwt.verify(token,process.env.TOKEN_SECRET)
      // console.log(verify_jwt.uname)
      res
        .cookie("secret", token, {
            path:"localhost:3000/"
        })
        .cookie("uname", loginUname, {
          path:"localhost:3000/"
        })
        .json({"logged":1})
      // console.log(token);
    } else {
      res.json({"logged":0});
    }
  });

  // res.json({"ishome":1})
});


app.post("/logout", (req, res) => {
  res.clearCookie("secret").clearCookie("uname");
  res.json({"msg":"looged out succesfully"})
});



app.post("/signup", async (req, res) => {
  var signupName = req.body.signupName;
  var signupUname = req.body.signupUname;
  var signupPw = req.body.signupPassword;

  const hashedPw = await bcrypt.hash(signupPw, salt);

  console.log(signupName, signupUname, hashedPw);

  loginModel.findOne({ uname: signupUname },async (err, result) => {
    if (err) return err;
    if (result) {
        res.json({"available":0})
    } else {
      let new_user = new loginModel({
        uname: signupUname,
        pw: hashedPw,
        name: signupName,
      }).save();

      res.json({"nff" : 1})
      res.redirect("/home");
    }
  });
});




var seq =0;

postModel.findOne({}, (err, result) =>{
  if(result)
    seq = result.seq;
}).sort({seq:-1});


function getLoggedUser(token, uname) {
  //parameters : cookies.secret and cookies.uname
  var logged_user="";
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // console.log(user,typeof(user))
    if (err) return null;
    if (uname !== user.uname) return null;
    else
    logged_user = user.uname; 
  });
  return logged_user;
}



function authenticateToken(req, res, next) {
  const token = req.cookies.secret;

  if (token == null) return res.sendStatus(401);
  let logged_user=getLoggedUser(req.cookies.secret,req.cookies.uname);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    logged_user = user;
    if (err) return res.sendStatus(403);
    if (req.cookies.uname === logged_user.uname) {
      next();
    } else return res.sendStatus(403);

  });
}


app.get("/api", (req, res) => {
  res.send("jjj");
});



app.get("/api/get_username",authenticateToken,(req,res)=>{
  const username = jwt.verify(req.cookies.secret,process.env.TOKEN_SECRET)
  res.json({"username":`${username.uname}`})
})


app.post("/api/post",authenticateToken,async(req,res)=>{
  var uname = req.body.postUname;
  var title = req.body.postTitle;
  var desc = req.body.postDesc;
  var time = req.body.postTime;

  seq++;
  const new_post =await new postModel({
    uname : uname,
    title : title,
    desc: desc,
    time: time,
    seq: seq
  }).save();
  const new_interaction = await new interactionModel({
    seq : seq,
    dislike : 0,
    like:0
  }).save();
  res.json({"posted":1})
})

app.get("/api/post", authenticateToken, async (req, res) => {
  await postModel.find(
      { uname: { $ne: getLoggedUser(req.cookies.secret, req.cookies.uname) } },
      { _id: 0, time: 0, __v: 0 },async (err, result) => {
        if (err) {
          res.sendStatus(500);
          return;
        }
        if (result) {
          await res.send(result);
        } else {
          return res.status("404").json({ err });
        }
      }
    ).sort({ seq: -1 }).limit(5).clone();
}); 

app.get("/api/interaction/:id",authenticateToken,async (req,res)=>{
  const username = getLoggedUser(req.cookies.secret,req.cookies.uname);
  const seq = req.params.id;
  interactionModel.findOne({"seq" : seq},async(err,result)=>{
    if(err) throw err;
    if(result){
      res.json({
        "like": result.like,
        "dislike" : result.dislike,
        "seq" : result.seq,
        "liked_uname" : result.liked_uname,
        "disliked_uname" : result.disliked_uname
      })
    }
    else
      res.json({"isok":0});
  })
})

//merged two patch request of like and dislike to one 
app.patch("/api/interaction/:type",authenticateToken,async(req,res)=>{
  //type: like or dislike 
  const seq = req.body.seq;
  const fill = req.body.fill;
  const typeOfInteraction = req.params.type;
  var interaction;
  var updated_interaction;
  const username = getLoggedUser(req.cookies.secret,req.cookies.uname)
  await interactionModel.findOne({"seq":seq},async(err,result)=>{
    if(err) throw err;
    if(result){
      if(typeOfInteraction==="like")
        interaction = result.like;
      else if(typeOfInteraction==="dislike")
        interaction = result.dislike;
    }
  }).clone()
  //checking if user already interacted if yes then again interaction mean like to unlike
  if(fill===0)
    updated_interaction=interaction+1;
  else
    updated_interaction=interaction-1;
  

  if(typeOfInteraction==="like"){
    await interactionModel.findOne({"seq":seq},async(err,result)=>{
      if(err) throw err;
      result.like = updated_interaction
      
      //checking if username already entered if yes then delete else  push
      if(result.liked_uname.includes(username)){
        // console.log(result.liked_uname);
        result.liked_uname = result.liked_uname.filter(item=>item!==username);
      }
      else{
        result.liked_uname.push(username);
      } 
      await result.save();
      // console.log(result);
    }).clone();
  }
  else if(typeOfInteraction==="dislike"){
    await interactionModel.findOne({"seq":seq},async(err,result)=>{
      if(err) throw err;
      result.dislike = updated_interaction

      if(result.disliked_uname.includes(username)){
        result.disliked_uname = result.disliked_uname.filter(item=>item!==username);
      }
      else
      {
        result.disliked_uname.push(username);
      }
      await result.save();
      console.log(result);
    }).clone();
  }
  await res.json({"isok":1});
})




app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

