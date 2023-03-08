import React, { useState, useRef, useEffect, useContext ,memo } from "react";
import { UsernameContext } from "./pages/HomePage";
import { Link } from "react-router-dom";
import FetchError from "./FetchError";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {unfollow} from "../helper/unfollow.eventlistener"


var tempIsFetch = false;
function setFill(element) {
    if (element.classList.contains("fill-1")) {
        element.style =
            " font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48";
    } else {
        element.style =
            " font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 48";
    }
}

var refreshed = 0;
var temp;

function Post(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const backendurl = process.env.REACT_APP_BACKENDURL;
    const [interaction, setInteraction] = useState(() => {
        // console.log("setting interaction only once")
        return { like: 0, dislike: 0 };
    });
    
    const [comments, setComments] = useState([]);
    const usernameDefault = useContext(UsernameContext);
    // console.log(usernameDefault,"co")
    var interactionData = {};
    let username = useRef();
    let isliked = useRef(0);
    let isdisliked = useRef(0);
    let ishome = useRef(0);
    let isFirstFetch = useRef(0);
    let isProfilePage=useRef(0);
    if (window.location.pathname === "/home")
        ishome.current = 1;
    else ishome.current = 0;
    if(window.location.pathname==="/profile")
        isProfilePage.current=1;
    else isProfilePage.current=0;
    useEffect(() => { 
        if (window.location.pathname != "/home") {
            // username.current=data
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
                    // console.log(username.current)
                });
        } else {
            // username = usernameDefault;
            username.current = usernameDefault;
        }

        //setting style for liked and disliked based on props
        // console.log(props.isliked)
        if (props.isliked) {
            var element = document.getElementById("material-symbols-outlined-like-" + props.id);

            if (!element.classList.contains("fill-1")) {
                element.classList.add("fill-1");

            }
        }
        if (props.isdisliked) {
            var element = document.getElementById("material-symbols-outlined-dislike-" + props.id);

            if (!element.classList.contains("fill-1")) {
                element.classList.add("fill-1");
            }
        }
        function fetchIt() {
            // console.log("fetch",username.current)
            //fetching interactions

            fetch("/api/interaction/" + props.seq, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
                .then((response) => response.json())
                .then(async (data) => {
                    setInteraction({ like: data.like, dislike: data.dislike });
                    interactionData = data;
                    //loading post interaction either fill or unfill
                    var element = document.getElementById(
                        "material-symbols-outlined-like-" + props.id
                    );

                    if (interactionData.liked_uname.includes(username.current)) {
                        // console.log(interactionData.liked_uname)
                        isliked.current = 1;
                        element.classList.add("fill-1");
                        setFill(element);
                    }
                    var element = document.getElementById(
                        "material-symbols-outlined-dislike-" + props.id
                    );
                    if (interactionData.disliked_uname.includes(username.current)) {
                        // console.log(interactionData.disliked_uname)
                        isdisliked.current = 1;
                        element.classList.add("fill-1");
                        setFill(element);
                    }
                    //fetching profile image
                    // document.getElementById("post-header-profile-img").src = `http://localhost:8080/profile/profileImg/${username}`
                });


            //fetching comments
            fetch("/api/post/comment/" + props.seq, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
                .then((response) => response.json())
                .then(async (data) => {
                    // console.log(data)
                    setComments(data)
                });

            //setting temp variable to 1 for first fetch 
            isFirstFetch.current = 1;
            refreshed = 1;

        }

        // fetchIt();
        if (username.current !== "" && !isFirstFetch.current) {
            fetchIt();
        }

        //removing comment if user is in selfprofile page
        if (window.location.pathname === "/profile") {
            document.querySelectorAll(".comment-form").forEach(element => {
                element.outerHTML = "";
            })
        }

        

    }, []);
    
    // TODO: add post like button fill or unfill at  first load
    // TODO: add like count
    // TODO:  add like or dislike only one at a time
    // TODO: only increment like count if like is succesfully

    const submit_like = () => {
        // console.log("func",username.current)
        var element = document.getElementById(
            "material-symbols-outlined-like-" + props.id
        );
        element.classList.toggle("fill-1");
        // console.log(props.seq)
        const body = {
            seq: props.seq,
            fill: 0,
        };
        element.classList.contains("fill-1") ? (body.fill = 0) : (body.fill = 1);

        // console.log(body);
        fetch("/api/interaction/like", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((data) => { });

        setFill(element);
        if (body.fill === 0) {
            isliked.current = 1;
            setInteraction({
                like: interaction.like + 1,
                dislike: interaction.dislike,
            })
        } else {
            isliked.current = 0;
            setInteraction({
                like: interaction.like - 1,
                dislike: interaction.dislike,
            })
        }

    };
    const submit_dislike = () => {
        // console.log("func",username.current)

        var element = document.getElementById(
            "material-symbols-outlined-dislike-" + props.id
        );
        element.classList.toggle("fill-1");
        const body = {
            seq: props.seq,
            fill: 0,
        };
        element.classList.contains("fill-1") ? (body.fill = 0) : (body.fill = 1);
        fetch("/api/interaction/dislike", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((data) => { });
        setFill(element);
        if (body.fill === 0) {
            isdisliked.current = 1;
            setInteraction({
                like: interaction.like,
                dislike: interaction.dislike + 1,
            })
        } else {
            isdisliked.current = 0;
            setInteraction({
                like: interaction.like,
                dislike: interaction.dislike - 1,
            });
        }
    };

    useEffect(() => {
        setInterval(() => {
            // console.log(interaction)
            // console.count("refresh")
                    fetch("/api/interaction/" + props.seq, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    })
                        .then((response) => response.json())
                        .then(async (data) => {
                            interactionData = data;
                            temp = {
                                like: interactionData.like,
                                dislike : interactionData.dislike
                            }
                            if(temp!==interaction){
                                setInteraction({
                                    like: data.like,
                                    dislike: data.dislike,
                                });
                            }
                        });
                        // console.count("update called")
        }, 10000);//refresh interaction count after x amount of seconds 
    }, [])
    const num = 0;

    const submitComment = (e) => {
        const postCommentInput = document.getElementById(`post-comment-input-${props.seq}`);
        // console.log(postCommentInput.value)
        var commentPostBody = {
            comment: postCommentInput.value
        }
        fetch("/api/post/comment/" + props.seq, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(commentPostBody)
        })
            .then((response) => response.json())
            .then(async (data) => {
                // console.log(data)
                if(data.isPosted){//setting comment after succesfull response 
                    setComments((prev)=>[...prev,{
                        username:username.current,
                        comment: commentPostBody.comment
                    }])
                }
            })
        postCommentInput.value = "";
    }

    const postClicked = (e) => {
            // console.log(location)
            //if the post is on home page then only onclick, to avoid nested click on post components
            if (location.pathname === "/home") {
                navigate(`post/view/` + props.seq, {
                    state: {
                        seq: props.seq,
                        uname: props.uname,
                        title: props.title,
                        desc: props.desc,
                        isliked: isliked.current,
                        isdisliked: isdisliked.current
                    }
                })
            }

    }

    // newFunction(username, props);
    
  
    var i = 0;
    // console.log("isliked : ",isliked,"isdisliked:",isdisliked)
    // console.log(interaction,count++)
    return (
        <>
        {/* {console.log(interaction,count++)} */}
            <div className="post-container" >
                <div className="post-main">
                    {/* TODO: add link on click to navigate to profile page for below div */}
                    <div className="post-header">
                        <img
                            src={`http://${backendurl}/profile/profileImg/${props.uname}`}
                            alt=""
                            id="post-header-profile-img"
                            loading="lazy"
                            style={{
                                height: "2rem",
                                width: "2rem",
                                borderRadius: "50%",
                            }}
                        />
                        <Link
                            className="post-username"
                            to={`/user?username=${props.uname}`}
                        >
                            {" "}
                            {"@" + props.uname}
                        </Link>
                    {/* if current page is profile page then don't display unfollow button */}
                    {!isProfilePage.current ? <button className="follow-btn unfollow-btn" id={"unfollow-button-"+props.id} type="button"   onClick={()=>unfollow(username.current,props.uname,props.id)}>UnFollow</button> : ""}
                    {/* TODO: add filter after unfollowing  */}
                    </div>
                    <div className="post-body" id={`post-main-${props.seq}`} onClick={(e) => { postClicked(e) }} >
                        <div className="post-text-container">
                            <h3 className="post-title">{props.title}</h3>
                            <div className="post-desc-container">
                                <p>{props.desc}</p>
                            </div>
                        </div>
                        <div className="post-img-container">
                            <img id={`post-img-${props.seq}`} src={`http://${backendurl}/media/image/post/${props.uname}/${props.seq}`} alt="" srcSet="" />
                        </div>
                    </div>
                    <div className="interaction-container">
                        <button className="interaction-btn " onClick={submit_like}>
                            <span
                                className="material-symbols-outlined"
                                id={"material-symbols-outlined-like-" + props.id}
                            >
                                thumb_up_off
                            </span>
                            <span
                                className="post-like-count post-interaction-count"
                                id={"like-count-" + props.id}
                            >
                                {interaction.like}
                            </span>
                        </button>

                        <button className="interaction-btn" onClick={submit_dislike}>
                            <span
                                className="material-symbols-outlined "
                                id={"material-symbols-outlined-dislike-" + props.id}
                            >
                                thumb_down_off
                            </span>
                            <span
                                className="post-dislike-count post-interaction-count"
                                id={"dislike-count-" + props.id}
                            >
                                {interaction.dislike}
                            </span>
                        </button>
                    </div>
                    {/* if this post is on home page then don't show comment box  */}
                    {!ishome.current ?
                        <>
                            <div className="comment-form" >
                                <input type="text" id={`post-comment-input-${props.seq}`} className="post-text-input" placeholder="Add comment" autoComplete="off" />
                                <button className="post-btn" type="button" onClick={(e) => submitComment(e)}>Post</button>
                            </div>
                            <span className="comment-label">Comments</span>
                            <div className="comment-container">
                                {
                                    comments ? comments.map((obj) => {
                                        i++;
                                        return <span key={props.seq + "-" + i} className="comment"><a href="">@{obj.username}</a>&nbsp;{obj.comment} </span>
                                    }) : ""
                                }
                            </div>
                        </>
                        : ""}
                </div>
            </div>
        </>
    );
}

export default memo(Post)



