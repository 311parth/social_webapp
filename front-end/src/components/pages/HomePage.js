import React from 'react'
import Navbar from '../Navbar'
import Post from '../Post'
import Sidebar from '../../Sidebar'
import { useEffect, useState ,createContext,useContext } from 'react'

export const UsernameContext = createContext();

function HomePage() {

    const [username, setUsername] = useState();

    const [post, setPost] = useState([]);
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
                await setPost(data)
            })
    }, [])

    if (errorMsg === 1) {
        return (
            <h1>Loggin First 😡</h1>
        )
    }
    if (window.sessionStorage.getItem("islogged") === "1") {
        return (
            <>
                <UsernameContext.Provider value={username}>

                    {errorMsg === 1 ? <h1>Wrong Username,Password</h1> : ""}
                    <Navbar/>

                    <div className="home-page-container">
                        <div>

                            {post.map((post, i) => {
                                return <Post id={i.toString()} seq={post.seq} uname={post.uname} title={post.title} desc={post.desc} key={i} />
                                })
                            }
                        </div>
                    
                    {/* <Sidebar/> */}
                        <Sidebar/>

                    </div>

                </UsernameContext.Provider>
            </>
        )
    }
    else if (window.sessionStorage.getItem("islogged") !== "1") {
        window.location.href = "/login"
    }
}

export default HomePage
