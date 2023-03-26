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

const http = require("http")
const server = http.createServer(app);
app.use(express.static(path.join(__dirname+"/build")))



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


app.get("*",(req,res)=>{
  // console.log(req.url);
  // res.sendFile(path.join(__dirname+"/build/index.html"))
  res.sendFile(path.resolve(__dirname,'build','index.html'))
})
const port  = process.env.PORT || 8080;
server.listen(port,()=>{
  console.log(`Server running on port ${port}`);
})




