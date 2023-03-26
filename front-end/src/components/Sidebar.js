import React, { useEffect, useContext, useState } from "react";
import SidebarFollowCard from "./SidebarFollowCard";
import { UsernameContext } from "./pages/HomePage";
import FetchError from "./FetchError";

function Sidebar(props) {
  const username = useContext(UsernameContext);
  const [usernameArray, setUsernameArray] = useState();
  let urlHostname= window.location.host;
  const backendurl = process.env.REACT_APP_BACKENDURL;
  useEffect(() => {
    // console.log(username)
    const body = {
      username: username,
    };
    fetch("/api/v1/api/random/followcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsernameArray(data.usernameArray);
      });
  }, []);

  // console.log(1,usernameArray,typeof(usernameArray))

  if (usernameArray) {
    return (
      <>
        <div className="sidebar-main">
          <span className="sidebar-header-text">
            Account you may like to follow
          </span>

          <div className="sidebar-main-card-container">
            {Object.entries(usernameArray).map(([key, value]) => (
              // console.log(key,value,typeof(key),typeof(value));
              <SidebarFollowCard
                key={key}
                imgsrc={`http://${backendurl}/api/v1/profile/profileImg/${value}`}
                username={value}
                id={key}
              />
            ))}
          </div>
        </div>
      </>
    );
  } else {
    return <FetchError />;
  }
}

export default Sidebar;
