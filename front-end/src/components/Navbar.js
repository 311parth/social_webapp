import React,{useContext} from 'react'
import {Link, Navigate} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {UsernameContext} from "./pages/HomePage"

function Navbar(props) {

    const naviagate = useNavigate();

    const username = useContext(UsernameContext)

    const logout=()=>{
        fetch("/logout",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }).then((response)=>response.json())
        .then((data)=>console.log(data))
    }

    function showProfileList() {
        // var profileList = document.getElementsByClassName("profileList");
        // console.log(profileList)
        var profileList = document.getElementById('profileList');
        if(profileList)
        {
             if( profileList.style.display=== 'flex')
                profileList.style.display= 'none'
            else
                profileList.style.display= 'flex'
        }
    }

    return (
        <>
            <nav className="navbar">
                <div className="navLeft navContainer">
                    <li><Link to={"/home"}>Home</Link></li>
                    <li>
                        <Link 
                        to={"/post"}
                        state =  {{username : username}}
                        >Post
                        </Link>
                    </li>
                </div>
                <div className="navRight navContainer">
                    <li>
                        <button onClick={showProfileList}>Profile</button>
                    </li>
                    <li><Link to="/logout" onClick={logout}>Logout</Link></li>
                </div>
            </nav>
                         
        </>
    )
}

export default Navbar
