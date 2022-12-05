import React from "react";

function FetchError() {
  return (
    <span>
      Username is not fetched succesfully by server
      <a href="/login">login again</a>
    </span>
  );
}

export default FetchError;
