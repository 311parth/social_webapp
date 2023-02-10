import React,{useContext} from 'react'
import { Link } from "react-router-dom";
import ProfilePage, {UsernameContextProfilePage} from "./pages/ProfilePage"
function FollowingList(props) {
    const username = useContext(UsernameContextProfilePage);//logged username 
    // console.log(username);
    var linkUrl = `/user?username=${props.username}`;
    if(username ===props.username){//loggeduser is trying to visit own profile pic
        linkUrl="/profile"
    }
    return (
        <div className="follow-card">
            <div className="sidebar-img">
                <img src={props.imgsrc} loading="lazy" alt=""/>
            </div>
            <Link to={linkUrl}>@{props.username}</Link>
            {/* <Link to={{
                    pathname: "/user",
                    search: `?username=${props.username}`,
                  }} state={{query:props.username}}
            >@{props.username}</Link> */}

        </div>
    )
}

export default FollowingList
