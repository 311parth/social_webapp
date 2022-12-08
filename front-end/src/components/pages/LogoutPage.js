import React from 'react'
import {Link} from 'react-router-dom'


function LogoutPage() {
    return (
        <>
            <h3>Logout successfully</h3>
            <Link to={"/login"}>Login?</Link>
        </>
    )
}

export default LogoutPage
