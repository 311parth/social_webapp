function unfollow(username,unfollowedUsername,id) {
    // console.log("unfollowing...// following....");
    var body = {
        username: username,
        unfollowedUsername: unfollowedUsername//it is just label it can be followed username as well
        //when user is already following then this will work as follow action instead of unfollow because of flexible api of unfollow
    };
    // console.log(body,id);
    fetch("/api/unfollow", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
    })
        .then((res) => { return res.json(); })
        .then((data) => {
            if (data.isok === 1) {
                document.getElementById("unfollow-button-" + id).innerText = data.msg;
            }
        });
}

module.exports = {
    unfollow
}