
const jwt = require("jsonwebtoken");

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

module.exports = getLoggedUser;