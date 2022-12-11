import React, {useState, useEffect} from "react";
import { useLocation } from "react-router";
import Navbar from "../Navbar";
import Post from "../Post";
import  FollowingList from "../FollowingList.js"
import FetchError from "../FetchError";
function SelfProfilePage(props) {
    let navState = useLocation();
    // console.log(navState)
    let username = navState.state.username;
    // console.log("u", username);
   
    const [post, setPost] = useState([]);
    const [usernameArray,setUsernameArray] = useState([]);

    useEffect(() => {
        //fetching posts
        fetch(`/api/profile/post/${username}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
        }).then((res) => {
            if (res.ok) return res.json();
            else res.json({ "isok": 0 })
        })
            .then(async (data) => {
                // console.log(data);
                await setPost(data)
            })

        //fetching following 
        fetch(`/api/profile/${username}/following`,{
            method:"GET",
            headers:{
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
        })
        .then((res)=>{return res.json()})
        .then((data)=>{
            setUsernameArray(data)
        })
    }, [])

    function uploadProfileImg() {
        var inputProfileImg = document.getElementById("input-profile-img");
        const formData = new FormData();
        formData.append("inputProfileImg", inputProfileImg.files[0]);
        fetch(`/profile/profileimg/upload/${username}`, {
            method: "POST",
            credentials: "include",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                //must fetch it once to make sure that image exist on that route
                fetch(`http://localhost:8080/profile/profileImg/${username}`, {
                    method: "GET",
                })
                    .then((res) => res)
                    .then((data) => {
                        // console.log(data);
                    });
                document.getElementById(
                    "img-main"
                ).src = `http://localhost:8080/profile/profileImg/${username}`;
            });
    }

    if(usernameArray){
        return (
            <>
                <Navbar />
                <div className="profile-header-container">
                    
                    <h3>@{username}</h3>
                    <div>
                        <form >
                            <label className="change-img-container">
                                <span className="material-symbols-outlined material-icons-md " >
                                    account_circle
                                </span>
                                <span id="input-profile-img-text">
                                    tap to change profile pic
                                </span>
                                <input type="file" src="" name="inputProfileImg" id="input-profile-img" alt=""   style={
                                    {
                                        display: "none"
                                    }}
                                    onChange={() => {
                                        document.getElementById("input-profile-img-text").textContent = "selected waiting to upload"
                                    }}/>
                                <input type="button" className="submit-btn" value="save" onClick={uploadProfileImg} />
                            </label>
                        </form>
                        <img  src={`http://localhost:8080/profile/profileImg/${username}`} alt="" id="img-main" loading="lazy" width="50" height="50" style={{borderRadius: "50%",}}/>
                    </div>
                </div>
    
    
                    <div className="home-page-container">
                        <div className="home-post-container">
    
                            {post.map((post, i) => {
                                return <Post id={i.toString()} seq={post.seq} uname={post.uname} title={post.title} desc={post.desc} key={i} />
                                })
                            }
                        </div>
    
                        <div className="sidebar-main" style={{
                            height:"fit-content"
                        }}>
                            <span className="sidebar-header-text">
                                Account you may like to follow
                            </span>
                                {
                                    usernameArray.map((value,i)=>{
                                        return <FollowingList key={i.toString()}  username={value} imgsrc={`http://localhost:8080/profile/profileImg/${value}`} />
                                    })
                                }
                        </div>

                    </div>
                    
    
            </>
        );
    }
    else{
        return(
            <FetchError/>
        )
    }
}

export default SelfProfilePage;
