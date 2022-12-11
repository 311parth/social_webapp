import React,{useEffect} from 'react'
import {Link} from 'react-router-dom'


function LogoutPage() {

    useEffect(() => {
        // document.cookie =""
        //deleteing cookies
        var mydate = new Date();
        mydate.setTime(mydate.getTime() - 1);
        document.cookie =  "secret=; expires=" + mydate.toGMTString() 
        document.cookie= "uname=; expires=" + mydate.toGMTString() ; 
    }, [])

    return (
        <>
            <h3>Logout successfully</h3>
            <Link to={"/login"}>Login?</Link>
        </>
    )
}

export default LogoutPage
