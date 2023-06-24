const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.json());

var cookieParser = require("cookie-parser");
app.use(cookieParser());
const path = require("path")
const dotenv = require("dotenv");
dotenv.config({path:path.resolve(__dirname,"../.env")});


const { conn } = require("./db/db");

var cors = require("cors");
app.use(cors());

const home = require("./routes/home");
const checksignupusername = require("./routes/checksignupusername");
const login = require("./routes/login");
const logout = require("./routes/logout");
const api = require("./routes/api");
const signup = require("./routes/signup");
const profile = require("./routes/profileImg")
const media = require("./routes/media")
const followRoute = require("./routes/api/follow")
const unfollowRoute = require("./routes/api/unfollow");
const profileRoute = require("./routes/api/profile")
const postRoute = require("./routes/api/post");
const interactionRoute = require("./routes/api/interaction")
const userDetailRoute = require("./routes/api/user");
const http = require("http")
const server = http.createServer(app);

// app.use((req, res, next) => {
//   req.io = io;
//   return next();
// });
app.get("/", (req, res) => {
  res.send("he");
});

app.use("/api/v1/home", home);
app.use("/api/v1/checksignupusername", checksignupusername);
app.use("/api/v1/login", login);
app.use("/api/v1/logout", logout);
app.use("/api/v1/signup", signup);
app.use("/api/v1/api", api);
app.use("/api/v1/profile", profile);
app.use("/api/v1/media", media);
app.use("/api/v1/api/follow",followRoute);
app.use("/api/v1/api/unfollow",unfollowRoute);
app.use("/api/v1/api/profile",profileRoute);
app.use("/api/v1/api/post",postRoute);
app.use("/api/v1/api/interaction",interactionRoute);
app.use("/api/v1/api/user",userDetailRoute);

server.listen(process.env.PORT,()=>{
  console.log(`Server running on port ${process.env.PORT}`);
})




