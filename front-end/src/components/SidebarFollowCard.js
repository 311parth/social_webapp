import React,{useContext} from 'react'
import {UsernameContext,FollowingChangeContext} from "./pages/HomePage"
import { Link } from "react-router-dom";

function SidebarFollowCard(props) {
    //TODO: do not show username that already followed at first load
    const username = useContext(UsernameContext);//logged username 
    const followingChange = useContext(FollowingChangeContext);
    // console.log(followingChange)


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
                if(data.follow===1){
                    //this means that logged user is now follwoing props.username
                    followingChange.setFollowingChange({
                       username: props.username,
                       following:1
                    });
                }else{
                    //this means that logged user is now not follwoing props.username (follow button click by 2 times)
                    followingChange.setFollowingChange({
                        username: props.username,
                        following:0
                    });
                }
            }
        });
    }


    return (
        <div className="follow-card">
            <div className="sidebar-img">
                <img src={props.imgsrc} loading="lazy" alt=""/>
            </div>
            {/* <span>@{props.username}</span> */}
            <Link to={`/user?username=${props.username}`} className="sidebar-username">@{props.username}</Link>
            <button className="follow-btn" id={"follow-button-"+props.id} type="button" onClick={follow} >Follow</button>
        </div>
    )
}

export default SidebarFollowCard
