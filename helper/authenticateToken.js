const getLoggedUser = require("./getLoggedUser")

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    // console.log("authenticating req");
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

module.exports = authenticateToken;