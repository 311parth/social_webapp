import React,{useState,useRef,useEffect,useContext} from 'react'
import {UsernameContext} from "./pages/HomePage"


function setFill(element){
    if (element.classList.contains("fill-1")) {
        element.style = " font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 48"
    }
    else {
        element.style = " font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 48"
    }
}


function Post(props) {


    const [interaction,setInteraction]  = useState({like : 0,dislike:0});


    var interactionData = {};
    const username = useContext(UsernameContext);
    
    useEffect(() => {
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
            if(interactionData.liked_uname.includes(username)){
                // console.log(interactionData.liked_uname)
                element.classList.add("fill-1")
                setFill(element);
            }

            var element = document.getElementById("material-symbols-outlined-dislike-"+props.id)
            if(interactionData.disliked_uname.includes(username)){
                // console.log(interactionData.disliked_uname)
                element.classList.add("fill-1")
                setFill(element);
            }
        })
    }, [])


    
    // TODO: add post like button fill or unfill at  first load
    // TODO: add like count
    // TODO:  add like or dislike only one at a time
    // TODO: only increment like count if like is succesfully
    
    const submit_like=()=>{
        var element = document.getElementById("material-symbols-outlined-like-"+props.id)
        element.classList.toggle("fill-1")
        console.log(props.seq)
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


    function refreshStats(params) {
        console.log("u")
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
                setInteraction({like:data.like,dislike:data.dislike})
        })
    }

    const num=0;

    return (
        <>
            <div className="post-container">
                <div className="post-main">
                    <a className="post-username">{"@"+props.uname}</a>
                    <h3 className="post-title">{props.title}</h3>
                    <div className="post-desc-container">
                        <p>{props.desc}</p>
                    </div>

                    <div className="interaction-container">
                        <button className="interaction-btn " onClick={submit_like}>
                            <span className="material-symbols-outlined" id= {"material-symbols-outlined-like-"+props.id}  >
                                thumb_up_off
                            </span>
                            <span className="post-like-count post-interaction-count">
                                {interaction.like}
                            </span>
                        </button>

                        <button className="interaction-btn"  onClick={submit_dislike}>

                            <span className="material-symbols-outlined " id={"material-symbols-outlined-dislike-"+props.id}>
                                thumb_down_off
                            </span>
                            <span className="post-dislike-count post-interaction-count">
                                {interaction.dislike}
                            </span>
                        </button>

                        <button className="interaction-btn" onClick={refreshStats}>Refresh stats</button>
                    </div>


                </div>
            </div>
        </>
    )
}

export default Post
