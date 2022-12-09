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
                        <Link to="/profile" state={{username:username}} >Profile</Link>
                    </li>
                    <li><Link to="/logout" onClick={logout}>Logout</Link></li>
                </div>
            </nav>
                         
        </>
    )
}

export default Navbar
