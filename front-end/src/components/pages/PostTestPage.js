import React from 'react'
import { useNavigate } from 'react-router-dom';
import Post from '../Post';
import {useLocation} from 'react-router-dom';

function PostTestPage() {
    //TODO: optimise the re-rendering while go back
    const navigate = useNavigate();
    const location  =  useLocation();
    // console.log(location.state)
    const state = location.state;
    return (
        <>  

            <input type="button" value="back" onClick={()=>{navigate(-1)}}/>
            <Post id={state.seq} seq={state.seq} uname={state.uname} title={state.title} desc={state.desc} key={state.seq} isliked={location.state.isliked} isdisliked={location.state.isdisliked}/>
            {/* <Post/>  */}
        </>
    )
}

export default PostTestPage
