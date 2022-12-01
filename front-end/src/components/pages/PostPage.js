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
        
        document.getElementById("input-post-title").value = '';
        document.getElementById("input-post-desc").value = '';
        body.postUname = username;
        body.postTime = Date.now();
        console.log(body)
        fetch("/api/post",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(body),
            credentials: "include",
        }).then((resonse)=>resonse.json())
        .then((data)=>{
            console.log(data);
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
                <input type="button" onClick={post} value="post" className="post-input-submit post-input-element" />
            </form>
        </>
    )
}

export default PostPage
