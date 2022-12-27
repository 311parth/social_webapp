import React from 'react'
import Post from "../Post"

function TestPage() {
    
    window.onclick = (e)=>{
        const modal  = document.getElementById("modal")
        const modalOpen = document.getElementById("modal-open");
        if(e.target != modal && e.target != modalOpen){
            // modal.classList.remove("active")
            closeModal();
        }
    }
    const openModal = ()=>{
        document.getElementById("modal").classList.toggle("active")
        //TODO: replace document.body with parent container
        document.body.style.overflowY = "hidden"
    }
    const closeModal = ()=>{
        // console.log("closed")
        document.getElementById("modal").classList.remove("active")
        // document.body.style.overflow = "unset"
        document.body.style.overflowY="scroll"
        document.body.style.overflowX="hidden"
    }
    var modalOutside = document.querySelector(".modal-main");
    if(modalOutside){
        console.log(modalOutside)
        modalOutside.addEventListener("hover",()=>{
            console.log("btn clikced")
        })
    }
    



    
    return (
        <>  
            {/* <h2>modal</h2> */}
            <button id="modal-open" type="button" onClick={openModal}>press me</button>
            <div className="modal-main">
                <div id="modal">
                    <button id="modal-close" type="button" onClick={closeModal}> &times;</button>
                    <div className="modal-container">
                        <Post id="1" seq="60" uname="d" title="title" desc="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam repellat corporis nobis voluptatum. Distinctio voluptas ad, numquam reprehenderit facilis aspernatur?" key="1" />
                        {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo ducimus accusantium eaque officia aut laboriosam delectus doloribus nam debitis quaerat? */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TestPage;

