import React,{useRef} from 'react'
import { useLocation } from "react-router";

function ProfilePage(props) {
    let navState = useLocation();
    // console.log(navState)
    let username =navState.state.username;
    console.log("u",username)
    function uploadProfileImg() {
        var inputProfileImg = document.getElementById("input-profile-img"); 
        const formData  = new FormData();
        formData.append('inputProfileImg',inputProfileImg.files[0]);
        fetch(`/profile/profileimg/upload/${username}`,{
            method:"POST",
            credentials: "include",
            body : formData
            }).then((response) => response.json())
            .then((data) => {
            console.log(data);
            //must fetch it once to make sure that image exist on that route
            fetch(`http://localhost:8080/profile/profileImg/${username}`,{
                method:"GET",
            }).then((res)=> res)
            .then((data)=>{
                console.log(data);
            })
            document.getElementById("img-main").src = `http://localhost:8080/profile/profileImg/${username}`
        })


    }

    return (
        <>  
            <h2>Profile page</h2>
            <div>
                <input type="text" name="" id="input-username"/>
                <input type="file" src="" name="inputProfileImg" alt="" id="input-profile-img"/>
                <input type="button" value="submit" onClick={uploadProfileImg} />
            </div>
            
            <img src="" alt=""  id="img-main" width="50" height="50" style={
                {
                    borderRadius : "50%"
                }
            } />
        </>
    )
}

export default ProfilePage
