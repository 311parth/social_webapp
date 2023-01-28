const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.json());

var cookieParser = require("cookie-parser");
app.use(cookieParser());

const dotenv = require("dotenv");
dotenv.config();


const { conn } = require("./db/db");

var cors = require("cors");
app.use(cors());

const home = require("./routes/home");
const checksignupusername = require("./routes/checksignupusername");
const login = require("./routes/login");
const logout = require("./routes/logout");
const api = require("./routes/api");
const signup = require("./routes/signup");
const profile = require("./routes/profile")
const media = require("./routes/media")
const socketRouter = require("./routes/socketRouter") 

const http = require("http")
const server = http.createServer(app);

const io = require("socket.io")(server,{
  cors:{
    origin:"*"
  }
})
// app.use((req, res, next) => {
//   req.io = io;
//   return next();
// });
app.get("/", (req, res) => {
  res.send("he");
});

app.use("/home", home);
app.use("/checksignupusername", checksignupusername);
app.use("/login", login);
app.use("/logout", logout);
app.use("/signup", signup);
app.use("/api", api);
app.use("/profile", profile);
app.use("/media", media);
app.use("/socket",(req,res,next)=>{//passing io to this route
  req.io = io;
  next();
},socketRouter)

const socketEvents=require("./helper/socketEvents");
module.exports = {io}
socketEvents();

server.listen(process.env.PORT,()=>{
  console.log(`Server running on port ${process.env.PORT}`);
})




