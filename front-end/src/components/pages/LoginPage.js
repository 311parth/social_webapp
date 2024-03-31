import React,{useState} from 'react'
import Footer from '../Footer'
import {Link} from 'react-router-dom'


function LoginPage() {
    const [errormsg,setErrormsg] = useState(2);
    const [emptyFieldMsg,setemptyFieldMsg] = useState(2);
    var loginUnameTag = document.getElementById("loginuname");
    var loginPwTag = document.getElementById("loginpw");

    var uname = loginUnameTag?loginUnameTag.value : "";
    var pw = loginPwTag?loginPwTag.value : "";
    const islogged=(event)=> {
        // document.getElementById("loginuname").value = ""
        // document.getElementById("loginpw").value = ""

        event.preventDefault();
        const body = {
            loginUname: uname, 
            loginPassword: pw
        }  
        if(!body.loginUname || !body.loginPassword){
            setemptyFieldMsg(1);
            return;
        }
        setemptyFieldMsg(0);
        fetch("/api/v1/login",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            credentials: "include",
            body : JSON.stringify(body)
        }).then((resonse)=>resonse.json())
        .then((data)=>{
            console.log(data);
            if(data.logged===0){
                setErrormsg(1);
            }
            else{
                if(data.logged===1)
                {
                    window.sessionStorage.setItem("islogged","1")
                    window.location.href = "/home"
                }
            }
        })
    }
        return (
            <>
            <div className="loginFormContainer">
                <div className="loginFormMain">
                    <h3>Login</h3>
                    {emptyFieldMsg === 1 ? <h2 style={{color:"red"}}>Enter username password</h2> : ""}    
                    {errormsg === 1 ? <h1>Wrong username password</h1> : ""}    

                    <form onSubmit={islogged}>
                        <li>
                            <label>Username</label>
                            <input className="loginInput" id="loginuname" name="uname" type="text" placeholder="Username"  onChange={(e)=>{
                                uname = e.target.value
                            }} />
                        </li>
                        <li>
                            <label>Password</label>
                            <input className="loginInput" id="loginpw" name="password" type="password" placeholder="Password"  onChange={(e)=>{
                                pw = e.target.value
                            }}/>
                        </li>
                        <li>    
                            <input className="loginBtn" type="submit" value="Login" />
                        </li>
                        <li id="login-to-register-li">
                            Haven't register yet ? &nbsp; <Link to={"/signup"}> Register</Link>
                        </li>
                    </form>
                </div>
            </div>
            <Footer/>
            </>
        )


}

export default LoginPage
