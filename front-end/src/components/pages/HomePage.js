import React from 'react'
import Navbar from '../Navbar'
import Post from '../Post'
import Sidebar from '../Sidebar'
import { useEffect, useState ,createContext,useContext } from 'react'
import FetchError from '../FetchError'
export const UsernameContext = createContext();
export const FollowingChangeContext = createContext();


function HomePage() {

    const [username, setUsername] = useState();

    const [post, setPost] = useState([]);
    const [newPost, setNewPost] = useState([]);

    const [followingChange,setFollowingChange] = useState({
        username:"",
        following:null
    });




    useEffect(() => {
        fetch("/api/get_username", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        }).then((response) => response.json())
            .then((data) => {
                setUsername(data.username)
            })
    }, [])

    const [errorMsg, setErrotMsg] = useState(2);

    useEffect(() => {
        //fetching if user is logged or not
        fetch("/home", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        }).then(res => {
            if (res.ok) {
                return res.json()
            }
            else {
                setErrotMsg(1);
            }
        }).then(data => setErrotMsg(0))

        //fetching posts
        fetch("/api/post", {
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
    }, [])
    useEffect(() => {
        //this will update new followed/unfollowd user's latest 5 post (FOLLOWED OR UNFOLLOWED FROM SIDEBAR ONLY)

        // console.log("@",followingChange)

        //this means following
        if(followingChange.following===1){
            fetch(`/api/post/latest/${followingChange.username}`, {
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
                    // console.log(data,typeof(data))
                    data.forEach(element => {
                        newPost.push(element);
                    });
                    setNewPost([...newPost]);
            })
        }else{
            //removing post of latest unfollwoed account (ONLY FROM UNFOLLOWED FROM THE  SIDEBAR )
            setNewPost(newPost.filter((item)=>{
                return item.uname!== followingChange.username;
            }));
        }
        
    }, [followingChange])


    if (errorMsg === 1) {
        return (
            <h1>Loggin First 😡</h1>
        )
    }
    if (window.sessionStorage.getItem("islogged") === "1") {
        if(username){//if any only username is not undefined then load home page
            // console.log(post)
            return (
                <>
                    <UsernameContext.Provider value={username} >
                        {errorMsg === 1 ? <h1>Wrong Username,Password</h1> : ""}
                        <Navbar/>
    
                        <div className="home-page-container">
                            <div className="home-post-container">
                                { newPost[0] && newPost ?  newPost.map((newPost, i) => {
                                    return <Post id={newPost.seq} seq={newPost.seq} uname={newPost.uname} title={newPost.title} desc={newPost.desc} key={newPost.seq} />
                                    }) : ""
                                }

                                {/* {console.log("new",newPost,typeof(newPost))} */}

                                { post ?  post.map((post, i) => {
                                    return <Post id={post.seq} seq={post.seq} uname={post.uname} title={post.title} desc={post.desc} key={post.seq} />
                                    }) : ""
                                }
                            </div>
                            <FollowingChangeContext.Provider value={{followingChange,setFollowingChange}}>
                                <Sidebar/>
                            </FollowingChangeContext.Provider>
                        </div>
                    </UsernameContext.Provider>
                </>
            )
        }
        else{
            return(
                <FetchError/>
            )
        }
    }
    else if (window.sessionStorage.getItem("islogged") !== "1") {
        window.location.href = "/login"
    }
}
export default HomePage
