import React, { memo } from 'react'
import Navbar from '../Navbar'
import Post from '../Post'
import Sidebar from '../Sidebar'
import { useEffect, useState ,createContext,useContext ,useRef} from 'react'
import FetchError from '../FetchError'
import LoadingSpinner from '../LoadingSpinner'
import PostFeedEnd from './PostFeedEnd'
export const UsernameContext = createContext();
export const FollowingChangeContext = createContext();


function HomePage() {
    const username = useRef();

    // const [post, setPost] = useState([]);
    // const [newPost, setNewPost] = useState([]);

    const [followingChange,setFollowingChange] = useState({
        username:"",
        following:null
    });

    const [state,setState] = useState({
        post:[],
        newPost : [],
    });
    const [getPost,setGetPost] = useState(0);
    const [loading,setLoading] = useState(0);
    const isPostFeedEnd = useRef(0);
    const lastPostSeq = useRef(-1);
    const isFetchedAllready = useRef(0);
    const [usernameFlag,setUsernameFlag] = useState(0);
    useEffect(() => {
        fetch("/api/v1/api/get_username", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        }).then((response) => response.json())
            .then((data) => {
                // setUsername(data.username)
                username.current = data.username;
                setUsernameFlag(1);
            })

            //fetching if user is logged or not

            fetch("/api/v1/home", {
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
            fetch(`/api/v1/api/post?seq=${lastPostSeq.current}`, {
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
                    // console.log(data[data.length-1].seq)
                    if(data && data[data.length-1])lastPostSeq.current=data[data.length-1].seq;
                    // await setPost(data)
                    await setState({
                        post : data,
                        newPost : state.newPost
                    })
                })
    }, [])

    const [errorMsg, setErrotMsg] = useState(2);

    useEffect(() => {
        //this will update new followed/unfollowd user's latest 5 post (FOLLOWED OR UNFOLLOWED FROM SIDEBAR ONLY)

        // console.log("@",followingChange)

        //this means following
        if( followingChange.following===1){
            fetch(`/api/v1/api/post/latest/${followingChange.username}`, {
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
                    data && data.forEach(element => {
                        state.newPost.push(element);
                    });
                    setState({
                        post:state.post,
                        newPost : state.newPost,
                    })
            })
        }else{
            setState({
                post:state.post,
                newPost : (state.newPost.filter((item)=>{
                    //removing post of latest unfollwoed account (ONLY FROM UNFOLLOWED FROM THE  SIDEBAR )
                    return item.uname!== followingChange.username;
                }))
            })
        }
    }, [followingChange])

    useEffect(() => {
        //fetching posts
        if(getPost===0)return;//just to avoid  refetch in intial load case
        isFetchedAllready.current=1;//this flag=1  to indicate that fetching is in process and  post is beign rendered (avoid immediate re-fetch)

            fetch(`/api/v1/api/post?seq=${lastPostSeq.current}`, {
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
                // console.log(data)

                //TODO: fix : fetch is called twice when bottom hits
                //DONE: solution of above TODO is IsFetchedAllready flag
                if(!data[0]){
                    isPostFeedEnd.current=1;
                    return
                };
                lastPostSeq.current=data[data.length-1].seq
                await setState((prev) => ({
                    ...prev,
                    post: [...prev.post, ...data]
                }));


                //TODO: fix when post count is between 0 and n ex. maximum post server send is 8 but remaining post is 1 to 7  then set isPostFeedEnd to 1
                //DONE: below condition check TODO: make dynamic number of post for below condition
                if(data.length!==8)isPostFeedEnd.current=1;
                

                isFetchedAllready.current=0;//this flag=0  to indicate that fetching is done post is rendered (avoid immediate re-fetch)
                setLoading(0);
            })
      }, [getPost]);
    
    const handelInfiniteScroll = async () => {
        if(isPostFeedEnd.current){//if the post feed is ended then remove loading 
            setLoading(0);
            return;
        }
        if(isFetchedAllready.current)return;//here checking if isFetchedAllready is 1 then immediate re-fetch ( bottom touch twice immediatlly) req made 
        if(window.innerHeight + document.documentElement.scrollTop + 1 >=document.documentElement.scrollHeight ) {
            setLoading(1);
            setGetPost((prev)=>!prev)
        }
      };
      const setScrollEvent = ()=>{
        window.addEventListener("scroll", handelInfiniteScroll);
      }
      useEffect(() => {
        setScrollEvent();
        return () => window.removeEventListener("scroll", handelInfiniteScroll);
//The return statement inside a useEffect hook is called a "cleanup function." It's executed just before the component unmounts and before the next useEffect hook runs.
// In this case, the return statement inside the useEffect hook is used to remove the scroll event listener before the component unmounts. 
// This is necessary to prevent memory leaks by ensuring that there are no unnecessary event listeners left in the DOM after the component has been unmounted.
      }, []);
      


    if (errorMsg === 1) {
        return (
            <h1>Loggin First 😡</h1>
        )
    }
    if (window.sessionStorage.getItem("islogged") === "1") {
        if(username.current  && state.post){//if any only username is not undefined then load home page
            // console.log(username,post)
            return (
                <>

                    <UsernameContext.Provider value={username.current} >
                        {errorMsg === 1 ? <h1>Wrong Username,Password</h1> : ""}
                        <Navbar/>
                        <div className="home-page-container">
                            <div className="home-post-container">
                                { state.newPost[0] && state.newPost ?  state.newPost.map((newPost, i) => {
                                    return <Post id={newPost.seq} seq={newPost.seq} uname={newPost.uname} title={newPost.title} desc={newPost.desc} key={newPost.seq} />
                                    }) : ""
                                }
                                { state.post ?  state.post.map((post, i) => {
                                    return <Post id={post.seq} seq={post.seq} uname={post.uname} title={post.title} desc={post.desc} key={post.seq} />
                                    }) : ""
                                }
                                {isPostFeedEnd.current ? <PostFeedEnd/> :""}
                                {loading ? <LoadingSpinner/> : "" }
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

