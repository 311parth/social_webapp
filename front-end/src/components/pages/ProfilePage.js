import React, { useEffect, useRef, useState,createContext } from "react";
import FetchError from "../FetchError";
import Navbar from "../Navbar";
import Post from "../Post";
import FollowingList from "../FollowingList";
import { useLocation } from "react-router-dom";
export const UsernameContextProfilePage = createContext();
function ProfilePage(props) {
  const location = useLocation();
  
  const [post, setPost] = useState([]);
  const [usernameArray, setUsernameArray] = useState();
  const queryUsername = window.location.search.split("username=")[1];
  const username = useRef(-1);
  const [usernameFixed,setUsernameFixed] = useState();//to update that username is fetched and fixed
  
  const backendurl = process.env.REACT_APP_BACKENDURL;
  
  const [urlQueryChange,setUrlQueryChange] = useState(0);
  //there is problem if user is in this page and click sidebar(followerlist)then page is not re-rendering 
  useEffect(() => {
    setUrlQueryChange((prev)=>prev+1)
  }, [location])
  
    const setUsername =async()=>{
      if(username.current !==-1)return ;
      else{//this will trigger when user will reload this page(after reload username.current is undefined)
          await fetch("/api/v1/api/get_username", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              username.current = data.username;
              setUsernameFixed(1);
            });
      }
  }
  useEffect(() => {
    const intialLoadProfilePage=async()=>{
      // setQueryUsername(window.location.search.split('username=')[1]);
      //fetching posts
      fetch(`/api/v1/api/profile/post/${queryUsername}`, {
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
      if (!usernameArray || urlQueryChange!==0) {
        await fetch(`/api/v1/api/user?username=${queryUsername}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((res) => {
            return res.json();
          })
          .then(async(data) => {
             await setUsernameArray(data);
          });
      }
      if (!username.current) {
        await setUsername();
      }
    }
    intialLoadProfilePage();
  }, [setUsernameFixed,location]);
  useEffect(() => {
        fetch(`/api/v1/api/get_following`, {
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
  }, [username.current,location]);
//   console.log("fse",following)
  if (username.current === queryUsername) {
    window.location = "/profile";
  }
    if(usernameArray && username.current!==-1){
      return (
        <>
          <Navbar />
          <div className="profile-header-container">
            <h3>@{queryUsername}</h3>
            <div>
              <img
                src={`http://${backendurl}/api/v1/profile/profileImg/${queryUsername}`}
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
              // style={{
              //   height: "fit-content",
              // }}
            >
              <span className="sidebar-header-text">Followers</span>
              <div className="sidebar-main-card-container">
                <UsernameContextProfilePage.Provider value={username.current} >
                {usernameArray.map((value, i) => {
                  return (
                    <FollowingList
                      key={i.toString()}
                      username={value}
                      imgsrc={`http://${backendurl}/api/v1/profile/profileImg/${value}`}
                    />
                  );
                })}

                </UsernameContextProfilePage.Provider>
              </div>
            </div>
          </div>
        </>
      );
    }else{
      return <FetchError/>
    }
}

export default ProfilePage;
