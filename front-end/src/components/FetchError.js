import React from "react";
import {Link} from 'react-router-dom'

function FetchError() {
  return (
    <span>
      Username is not fetched succesfully by server
      <Link to={"/login"}>login again</Link>
    </span>
  );
}

export default FetchError;
