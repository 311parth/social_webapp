import React, {useEffect , useContext,useState} from 'react'
import SidebarFollowCard from './SidebarFollowCard'
import {UsernameContext} from "./pages/HomePage"
import FetchError from './FetchError'

function Sidebar(){
    const username = useContext(UsernameContext)
    const [usernameArray,setUsernameArray] = useState();
    useEffect(() => {
        // console.log(username)
        const body = {
            username: username
        }
        fetch("/api/random/followcard",{
            method:"POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        })
        .then((res)=>{return res.json()})
        .then((data)=>{
            setUsernameArray(data.usernameArray)
        })
    }, [])
    
    // console.log(1,usernameArray,typeof(usernameArray))

    if(usernameArray){
        return (    
            <>
                <div className="sidebar-main">
                    <span className="sidebar-header-text">
                        Account you may like to follow
                    </span>

                    {Object.entries(usernameArray).map(([key,value])=>
                        // console.log(key,value,typeof(key),typeof(value));
                        <SidebarFollowCard key={key} imgsrc="/img/avatar1.png" username={value} id={key}/>
                    )
                    
                    }

                    {/* <SidebarFollowCard imgsrc="/img/avatar1.png"  username="Username" id="1"/> */}
                    {/* <SidebarFollowCard imgsrc="/img/avatar1.png" username="Username2" id="2"/> */}
                </div>
            </>
        )
    }
    else{
        return(
            <FetchError/>
        )
    }
}

export default Sidebar
