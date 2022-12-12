import React,{useState,useRef,useEffect,useContext} from 'react'
import {UsernameContext} from "./pages/HomePage"
import {Link} from 'react-router-dom'
import FetchError from './FetchError';

var tempIsFetch = false;
function setFill(element){
    if (element.classList.contains("fill-1")) {
        element.style = " font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48"
    }
    else {
        element.style = " font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 48"
    }
}

var fetchNow = 0;

function Post(props) {

    // const [interaction,setInteraction]  = useState({like : 0,dislike:0});

    const [interaction,setInteraction]  = useState(()=>{
        // console.log("setting interaction only once")
        return {like:0,dislike:0};
    });


    const usernameDefault= useContext(UsernameContext);

    var interactionData = {};
    let username = useRef(); 
    // console.log(window.location.pathname)
    useEffect(() => {
        if(window.location.pathname==="/user"){
            fetch("/api/get_username", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            }).then((response) => response.json())
                .then((data) => {
                    // username = data.username;
                    username.current= data.username;
                    // console.log(username.current)
                })
        }else{
            // username = usernameDefault;
            username.current = usernameDefault;

        }
        function fetchIt() {
            // console.log("fetch",username.current)

        fetch("/api/interaction/"+props.seq, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        }).then((response) => response.json())
        .then(async(data) => {
            setInteraction({like:data.like,dislike: data.dislike})
            interactionData = data;
            //loading post interaction either fill or unfill
            var element = document.getElementById("material-symbols-outlined-like-"+props.id)
            if(interactionData.liked_uname.includes(username.current)){
                // console.log(interactionData.liked_uname)
                element.classList.add("fill-1")
                setFill(element);
            }
            var element = document.getElementById("material-symbols-outlined-dislike-"+props.id)
            if(interactionData.disliked_uname.includes(username.current)){
                // console.log(interactionData.disliked_uname)
                element.classList.add("fill-1")
                setFill(element);
            }
            //fetching profile image 
            // document.getElementById("post-header-profile-img").src = `http://localhost:8080/profile/profileImg/${username}`
        })
        }
        // fetchIt();
        if(username.current!==""){
            fetchIt();
        }
    }, [])


    
    // TODO: add post like button fill or unfill at  first load
    // TODO: add like count
    // TODO:  add like or dislike only one at a time
    // TODO: only increment like count if like is succesfully
    
    const submit_like=()=>{
        // console.log("func",username.current)
        var element = document.getElementById("material-symbols-outlined-like-"+props.id)
        element.classList.toggle("fill-1")
        // console.log(props.seq)
        const body= {
            seq: props.seq,
            fill : 0,
        }
        element.classList.contains("fill-1") ? body.fill=0 : body.fill=1;

        // console.log(body);
        fetch("/api/interaction/like",{
            method:"PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body : JSON.stringify(body)
        }).then((res)=>res.json()).then((data)=>{})

        setFill(element);
        body.fill===0 ? setInteraction({like : interaction.like+1,dislike : interaction.dislike}) : setInteraction({like:interaction.like-1,dislike:interaction.dislike})

    }
    const submit_dislike=()=>{
        // console.log("func",username.current)


        var element = document.getElementById("material-symbols-outlined-dislike-"+props.id)
        element.classList.toggle("fill-1")
        const body= {
            seq: props.seq,
            fill : 0
        }
        element.classList.contains("fill-1") ? body.fill=0 : body.fill=1;
        fetch("/api/interaction/dislike",{
            method:"PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body : JSON.stringify(body)
        })
        .then((res)=>res.json())
        .then((data)=>{})
        setFill(element);
        body.fill===0? setInteraction({like:interaction.like,dislike:interaction.dislike+1}) :  setInteraction({like:interaction.like,dislike:interaction.dislike-1})
    }

    const isfetch = useRef(tempIsFetch);
    const [fetchNow,setFetchNow] = useState(0);
    useEffect(() => {
        // console.log("refetched")
        if (!isfetch.current) {
        // your API call func
            // console.log("u")
            fetch("/api/interaction/"+props.seq, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            }
            ).then((response) => response.json())
            .then(async (data) => {
                interactionData = data;
                // console.log(interactionData.liked_uname.includes(username.current),interactionData)
                setInteraction({like : interactionData.like,dislike:interactionData.dislike})
                var liked_uname = interactionData.liked_uname;
                var disliked_uname = interactionData.disliked_uname;

                const like_element = document.getElementById("material-symbols-outlined-like-"+props.id)
                const dislike_element = document.getElementById("material-symbols-outlined-dislike-"+props.id)

                //if two page is concurrently open then updating interactions:
                if(liked_uname.includes(username.current)){
                        like_element.classList.add("fill-1")
                        like_element.style = " font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48"
                }else{
                    if(like_element.classList.contains("fill-1")){
                        like_element.classList.remove("fill-1");
                        like_element.style = " font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 48"

                    }
                }
                if (disliked_uname.includes(username.current)) {
                    dislike_element.classList.add("fill-1")
                    dislike_element.style = " font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48"
                } else {
                    if (dislike_element.classList.contains("fill-1")) {
                        dislike_element.classList.remove("fill-1");
                        dislike_element.style = " font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 48"
                    }
                }
            })
        }

        isfetch.current = true;
        tempIsFetch = true;
    }, [fetchNow]);


    setTimeout(() => {
        isfetch.current=false;
        if(fetchNow===0)
            setFetchNow(1);
        else
            setFetchNow(0);
    }, 5000);
    const num=0;
        return (
            <>
                <div className="post-container">
                    <div className="post-main">
                            {/* TODO: add link on click to navigate to profile page for below div */}
                        <div className="post-header">
                            <img src={`http://localhost:8080/profile/profileImg/${props.uname}`} alt="" id="post-header-profile-img" loading="lazy" style={{
                                height:"2rem",
                                width:"2rem",
                                borderRadius:"50%"
                            }}/>
                            <Link className="post-username"  
                            to={`/user?username=${props.uname}`}
                            > {"@"+props.uname}</Link>
                        </div>
                        <h3 className="post-title">{props.title}</h3>
                        <div className="post-desc-container">
                            <p>{props.desc}</p>
                        </div>
    
                        <div className="interaction-container">
                            <button className="interaction-btn " onClick={submit_like}>
                                <span className="material-symbols-outlined" id= {"material-symbols-outlined-like-"+props.id}  >
                                    thumb_up_off
                                </span>
                                <span className="post-like-count post-interaction-count" id={"like-count-"+props.id}>
                                    {interaction.like}
                                </span>
                            </button>
    
                            <button className="interaction-btn"  onClick={submit_dislike}>
    
                                <span className="material-symbols-outlined " id={"material-symbols-outlined-dislike-"+props.id}>
                                    thumb_down_off
                                </span>
                                <span className="post-dislike-count post-interaction-count" id={"dislike-count-"+props.id} >
                                    {interaction.dislike}
                                </span>
                            </button>
    
    
                        </div>
    
    
                    </div>
                </div>
            </>
        )
}

export default Post
