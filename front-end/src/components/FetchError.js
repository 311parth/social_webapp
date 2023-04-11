import React from "react";
import {Link} from 'react-router-dom'

function FetchError() {
  return (
    <span style={{color:"white",background:"black"}}>
      wait 10seconds <br/>
      Something went wrong 
      <Link to={"/login"}>login again</Link>
    </span>
  );
}

export default FetchError;
