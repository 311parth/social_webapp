import React from 'react'
import { useNavigate } from 'react-router-dom';
import Post from '../Post';
import {useLocation} from 'react-router-dom';
import FetchError from '../FetchError';

function PostViewPage() {
    //TODO: optimise the re-rendering while go back
    const navigate = useNavigate();
    const location  =  useLocation();
    // console.log(location.state)
    const state = location.state;
        if(state){
            return (
            <>
                    <button onClick={()=>{navigate(-1)}} className="back-btn">
                        <span className="material-symbols-outlined back-icon">
                            arrow_back
                        </span>
                        <span>Back</span>
                    </button>
    
                <Post id={state.seq} seq={state.seq} uname={state.uname} title={state.title} desc={state.desc} key={state.seq} isliked={location.state.isliked} isdisliked={location.state.isdisliked}/>
                {/* <Post/>  */}
            </>
        )
    }else{
        return <FetchError/>
    }
}

export default PostViewPage
