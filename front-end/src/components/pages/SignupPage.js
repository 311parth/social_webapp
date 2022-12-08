import React, { useState } from "react";
import Footer from "../Footer";
import UsernameError from "../UsernameError";
import { Link } from 'react-router-dom'

function SignupPage() {
  const [errormsg, setErrormsg] = useState(2);

  var name = "";
  var uname = "";
  var pw = "";

  const checkSignUp = (event) => {
    console.log(event);
    event.preventDefault();
    const body = {
      signupName: name,
      signupUname: uname,
      signupPassword: pw,
    };
    console.log(JSON.stringify(body));
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((resonse) => resonse.json())
      .then((data) => {
        if (data.available === 0) {
          setErrormsg(1);
          console.log(data.available);
        } else {
          console.log(data);
          const formData = new FormData();
          var inputProfileImg = document.getElementById("inputProfileImg");
          formData.append('inputProfileImg', inputProfileImg.files[0]);
          //now username is granted and unique so now i can upload profile image
          fetch(`/profile/profileimg/upload/${data.uname}`, {
            method: "POST",
            credentials: "include",
            body: formData
          }).then((res) => res.json())
            .then((data) => {

              console.log(data);
              if (data.isuploaded === 1)
                window.location.href = "/login";
            })
        }
      });
  };

  return (
    <>
      <div className="loginFormContainer">
        <div className="loginFormMain">
          <h3>Signup</h3>

          <form onSubmit={checkSignUp} className="loginForm">
            <li>
              <label>Full name</label>
              <input
                className="signupInput"
                type="text"
                placeholder="Full name"
                onChange={(e) => {
                  name = e.target.value;
                }}
              />
            </li>

            <li>
              <label>Username</label>
              <input
                className="signupInput"
                type="text"
                placeholder="Username"
                onChange={(e) => {
                  uname = e.target.value;
                }}
              />
            </li>
            <li>{errormsg === 1 ? <UsernameError /> : ""}</li>
            <li>
              <label>Password</label>
              <input
                className="signupInput"
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  pw = e.target.value;
                }}
              />
            </li>
            <li>
              {/* <label >Profile Picture</label> */}
              <label className="input-profile-img">
                <span className="material-symbols-outlined material-icons-md " >
                  account_circle
                </span>
                <span id="input-profile-img-text">
                  tap to select profile pic
                </span>
                <input type="file" name="" id="inputProfileImg" style={
                  {
                    display: "none"
                  }}
                  onChange={() => {
                    document.getElementById("input-profile-img-text").textContent = "selected waiting to upload"
                  }}
                />
              </label>
            </li>

            <li>
              <input className="loginBtn" type="submit" value="Signup" />
            </li>

          </form>

          <span>
            Already a user? &nbsp; <Link to={"/login"}>Login</Link>
          </span>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SignupPage;
