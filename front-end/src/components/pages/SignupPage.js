import React, {useState} from 'react';
import Footer from '../Footer'
import UsernameError from '../UsernameError';

function SignupPage() {
    const [errormsg,setErrormsg] = useState(2);
    
    var name = ""
    var uname = ""
    var pw = ""

    const checkSignUp=(event)=>{
        console.log(event)
        event.preventDefault();  
        const body = {
            signupName: name,
            signupUname: uname, 
            signupPassword: pw
        }
        console.log(JSON.stringify(body))
        fetch("/signup",{
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json',
              },
            body : JSON.stringify(body)
        }).then((resonse)=>resonse.json())
        .then((data)=>{
            if(data.available===0){
                setErrormsg (1)
                console.log(data.available)
            }
            else{
                console.log(data)
                window.location.href = "/login"
            }
        })
    }
    
    return(
        <>

            <div className="loginFormContainer">
                <div className="loginFormMain">

                    <h3>Signup</h3>

                    <form onSubmit={checkSignUp} className="loginForm">
                        <li>
                            <label>Full name</label>
                            <input className="signupInput" type="text"placeholder="Full name" onChange={(e)=>{
                                name =e.target.value
                            }}/>
                        </li>

                        <li>
                            <label>Username</label>
                            <input className="signupInput" type="text"  placeholder="Username" onChange={(e)=>{
                                uname = e.target.value
                            }}/>
                        </li>
                        <li>
                            {errormsg === 1 ? <UsernameError/> : ""}    
                        </li>
                        <li>
                            <label>Password</label>
                            <input className="signupInput" type="password"  placeholder="Password" onChange={(e)=>{
                                pw=e.target.value
                            }}/>
                        </li>
                        <li>
                            <input className="loginBtn" type="submit" value="Signup" />
                        </li>
                    </form>

                    <span>Already a user? &nbsp; <a href="/login">Login</a></span>
                </div>
            </div>


            <Footer/>

        </>
    )
}

export default SignupPage
