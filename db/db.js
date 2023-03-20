  const mongoose = require("mongoose");

  const dburl = process.env.MONGODB_URL;
  mongoose.connect(dburl);

  const conn = mongoose.createConnection(dburl);

  conn.once("open",()=>{
    console.log("DB is open")
  })

  module.exports = {
    conn: conn,
  };
