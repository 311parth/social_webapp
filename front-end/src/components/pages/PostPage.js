import React from 'react'
import Navbar from '../Navbar'

import {useLocation} from 'react-router-dom'

function PostPage(props) {

    //for getting data from page to page 
    // https://stackoverflow.com/questions/67061088/can-not-pass-state-with-react-router-dom-v6-beta-state-is-null
    let location = useLocation();
    var username = location.state.username

    var body ={
        postUname :"",
        postTitle:"",
        postDesc:"",
        postTime: Date.now()
    }
    const post =(event) =>{
        var isPostImg;
       

        body.postUname = username;
        body.postTime = Date.now();
        var formData = new FormData();
        var inputPostImg = document.getElementById("inputPostImg");
        if(inputPostImg.files[0]){
            isPostImg=1
            //renaming file name acc to https://stackoverflow.com/questions/21720390/how-to-change-name-of-file-in-javascript-from-input-file
            var renamedFile = new File([inputPostImg.files[0]], Date.now()+inputPostImg.files[0].name, {type: inputPostImg.files[0].type})
            formData.append('inputPostImg',  renamedFile);
            // console.log(renamedFile)
        }else{
            isPostImg=0;
        }

        formData.append('postUname',body.postUname)
        formData.append('postTitle',body.postTitle)
        formData.append('postDesc',body.postDesc)
        formData.append('postTime',body.postTime)
        formData.append('isPostImg',isPostImg)

        // console.log("inputPostImg",formData.get('inputPostImg'))

        // console.log(formData.get('postUname'))

        console.log(body)
        fetch("/api/post",{
            method: 'POST',
            credentials: "include",
            body:formData
        }).then((resonse)=>resonse.json())
        .then((data)=>{
            // console.log(data);

            //reseting form
            document.getElementById("input-post-title").value = '';
            document.getElementById("input-post-desc").value = '';
            document.getElementById("inputPostImg").value = '';
            document.getElementById("input-post-img-text").textContent = "Tap to Attach Image"

        })
    }




    

    return (
        <>
            <Navbar/>
            <form className="post-input">
                <input type="text"  name="" id="input-post-title"  className="post-input-title post-input-element" placeholder="Title" 
                    onChange={(e)=>{body.postTitle = e.target.value}}
                />
                <textarea type="text" name="" id="input-post-desc"  className="post-input-desc post-input-element" placeholder="Description"
                    onChange={(e)=>{body.postDesc = e.target.value}}
                />

                <label className="input-profile-img">
                    <span className="material-symbols-outlined material-icons-md " >
                    image
                    </span>
                    <span id="input-post-img-text">
                    Tap to Attach Image
                    </span>
                        <input type="file" name="" id="inputPostImg" style={
                        {
                            display: "none"
                        }}
                        onChange={async() => {
                            document.getElementById("input-post-img-text").textContent = "Attached"
                        }}
                    />
              </label>
                <input type="button" onClick={post} value="post" className="post-input-submit post-input-element" />
            </form>
        </>
    )
}

export default PostPage
