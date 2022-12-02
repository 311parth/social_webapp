import React from 'react'

function Sidebar() {
    return (
        <>
            <div className="sidebar-main">
                <span className="sidebar-header-text">
                    Account you might like to follow
                </span>
                <div className="follow-card">
                    <div className="sidebar-img">
                        <img src="/img/avatar1.png" alt="" />
                    </div>
                    <span>@Username</span>
                    <button className="follow-btn">Follow</button>
                </div>

                <div className="follow-card">
                    <div className="sidebar-img">
                        <img src="/img/avatar1.png" alt="" />
                    </div>
                    <span>@Username</span>
                    <button className="follow-btn">Follow</button>
                </div>
            </div>

        </>
    )
}

export default Sidebar
