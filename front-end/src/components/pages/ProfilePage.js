import React, { useEffect, useRef, useState } from "react";
import FetchError from "../FetchError";
import Navbar from "../Navbar";
import Post from "../Post";
import FollowingList from "../FollowingList";
function ProfilePage() {
  //TODO: complete profilePage
  // const [queryUsername, setQueryUsername] = useState();

  const [post, setPost] = useState([]);
  const [usernameArray, setUsernameArray] = useState();
  const queryUsername = window.location.search.split("username=")[1];
  const username = useRef(-1);
  const [isfollow, setIsfollow] = useState(-1);
  const [following, setFollowing] = useState();

    const setUsername =async()=>{
      if(username.current !==-1)return ;
      else{//this will trigger when user will reload this page(after reload username.current is undefined)
          await fetch("/api/get_username", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              username.current = data.username;
            });
      }
  }
  useEffect(() => {
    // setQueryUsername(window.location.search.split('username=')[1]);
    //fetching posts
    fetch(`/api/profile/post/${queryUsername}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        else res.json({ isok: 0 });
      })
      .then(async (data) => {
        // console.log(data);
        await setPost(data);
      });

    //fetching following
    if (!usernameArray) {
      fetch(`/api/user?username=${queryUsername}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setUsernameArray(data);
        });
    }
    if (!username.current) {//TODO: refector below cond with setUsername()
      fetch("/api/get_username", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          // username = data.username;
          username.current = data.username;
        });
    }
  }, [username.current]);
  useEffect(() => {
        fetch(`/api/get_following`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            credentials: "include",
        })
        .then((res) => {
            return res.json();
        })
        .then(async(data) => {
            // console.log(data);
            //data = array of following username for logged user
            await setUsername();

            const followBtn = document.getElementsByClassName("follow-btn");
            //TODO: complete unfollow 
            if(data.includes(queryUsername)){//if true then user is already following that user
              // console.log("user is already following")
              for (const i in followBtn) {//since this page is profile page so all the posts are for same user so no need to check for all post of the page
                if(followBtn[i].textContent){
                  followBtn[i].textContent="unfollow"
                }
              }
            }else{
              for (const i in followBtn) {
                if(followBtn[i].textContent){
                  followBtn[i].textContent="follow";
                }
              }
            }
          });
  }, [username.current]);
//   console.log("fse",following)
  if (username.current === queryUsername) {
    window.location = "/profile";
  }
  if (!usernameArray) {
    return <FetchError />;
  } else {
    return (
      <>
        <Navbar />
        <div className="profile-header-container">
          <h3>@{queryUsername}</h3>
          <div>
            <img
              src={`http://localhost:8080/profile/profileImg/${queryUsername}`}
              alt=""
              id="img-main"
              loading="lazy"
              width="50"
              height="50"
              style={{ borderRadius: "50%" }}
            />
          </div>
        </div>

        {/* TODO: add interaction for this page */}
        <div className="home-page-container">
          <div className="home-post-container">
            {post.map((post, i) => {
              return (
                <Post
                  id={i.toString()}
                  seq={post.seq}
                  uname={post.uname}
                  title={post.title}
                  desc={post.desc}
                  key={i}
                />
              );
            })}
          </div>

          <div
            className="sidebar-main"
            style={{
              height: "fit-content",
            }}
          >
            <span className="sidebar-header-text">Followers</span>
            <div className="sidebar-main-card-container">
              {usernameArray.map((value, i) => {
                return (
                  <FollowingList
                    key={i.toString()}
                    username={value}
                    imgsrc={`http://localhost:8080/profile/profileImg/${value}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ProfilePage;
