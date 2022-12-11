import React, { useEffect, useState } from 'react'
import FetchError from "../FetchError"
function ProfilePage() {

    //TODO: complete profilePage 
    const [username, setUsername] = useState();
    useEffect(() => {
        fetch("/api/get_username", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        }).then((response) => response.json())
            .then((data) => {
                console.log(data)
                setUsername(data.username)
            })
    }, [])
    if (username === '') {
        return (
            <FetchError />
        )
    }
    else {
        return (
            <div>
                profle page
                {window.location.pathname}
            </div>
        )
    }

}

export default ProfilePage
