import React from 'react'

function FollowingList(props) {
    return (
        <div className="follow-card">
            <div className="sidebar-img">
                <img src={props.imgsrc} loading="lazy" alt=""/>
            </div>
            <span>@{props.username}</span>
        </div>
    )
}

export default FollowingList
