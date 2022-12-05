import React,{useContext} from 'react'
import {UsernameContext} from "./pages/HomePage"

function SidebarFollowCard(props) {
    //TODO: do not show username that already followed at first load
    const username = useContext(UsernameContext);//logged username 
    function follow(params) {
        var body = {
            username : username,
            followedUsername : props.username
        };
        fetch("/api/follow",{
            method:"POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        })
        .then((res)=>{return res.json()})
        .then((data)=>{
            // console.log(data,typeof(data))
            if(data.isok ===1)
            {
                // console.log("h")
                document.getElementById("follow-button-"+props.id).innerText = data.msg;
            }
        });
    }


    return (
        <div className="follow-card">
            <div className="sidebar-img">
                <img src={props.imgsrc} alt="" />
            </div>
            <span>@{props.username}</span>
            <button className="follow-btn" id={"follow-button-"+props.id} type="button" onClick={follow} >Follow</button>
        </div>
    )
}

export default SidebarFollowCard
