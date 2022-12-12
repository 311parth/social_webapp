import React, { useEffect, useState } from 'react'
import FetchError from "../FetchError"
import Navbar from '../Navbar';
import Post from '../Post';
import FollowingList from '../FollowingList';
function ProfilePage() {

    //TODO: complete profilePage 
    // const [queryUsername, setQueryUsername] = useState();

    const [post, setPost] = useState([]);
    const [usernameArray,setUsernameArray] = useState([]);
    const queryUsername = window.location.search.split('username=')[1];
    useEffect(() => {
        // setQueryUsername(window.location.search.split('username=')[1]);
        //fetching posts 
        fetch(`/api/profile/post/${queryUsername}`, {
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
        fetch(`/api/user?username=${queryUsername}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
            .then((res) => { return res.json() })
            .then((data) => {
                setUsernameArray(data)
            })
    }, [])

    if (!usernameArray) {
        return (
            <FetchError />
        )
    }
    else {
        return (
            <>
                <Navbar />
                <div className="profile-header-container">
                    
                    <h3>@{queryUsername}</h3>
                    <div>
                        <img  src={`http://localhost:8080/profile/profileImg/${queryUsername}`} alt="" id="img-main" loading="lazy" width="50" height="50" style={{borderRadius: "50%",}}/>
                    </div>
                </div>
                    
                    {/* TODO: add interaction for this page */}
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
                                Followers
                            </span>
                                {
                                    usernameArray.map((value,i)=>{
                                        return <FollowingList key={i.toString()}  username={value} imgsrc={`http://localhost:8080/profile/profileImg/${value}`} />
                                    })
                                }
                        </div>

                    </div>
    
            </>
        )
    }

}

export default ProfilePage
