import React from 'react'
import Post from "../Post"
import io from 'socket.io-client'

function TestPage() {
    const socket =io.connect('http://localhost:8080/')

    // window.onload=()=>{
    //     // const socket =io.connect('http://localhost:8080/')
    //     console.log(socket)
    //     socket.on("connect",()=>{
    //         console.log(socket.id)
    //     })
    // }
    socket.on("connect",()=>{
        console.log(socket.id)
    })
    socket.on("hello",(args)=>{
        console.log(args)
    })


    
    // setInterval(() => {
    //     socket.emit("reqInteraction",27);
    //     socket.once("resInteraction",(args)=>{
    //         console.log("res:",args);
    //     })
    // }, 5000);


    // window.onclick = (e)=>{
    //     const modal  = document.getElementById("modal")
    //     const modalOpen = document.getElementById("modal-open");
    //     if(e.target != modal && e.target != modalOpen){
    //         // modal.classList.remove("active")
    //         closeModal();
    //     }
    // }
    // const openModal = ()=>{
    //     document.getElementById("modal").classList.toggle("active")
    //     //TODO: replace document.body with parent container
    //     document.body.style.overflowY = "hidden"
    // }
    // const closeModal = ()=>{
    //     // console.log("closed")
    //     document.getElementById("modal").classList.remove("active")
    //     // document.body.style.overflow = "unset"
    //     document.body.style.overflowY="scroll"
    //     document.body.style.overflowX="hidden"
    // }
    // var modalOutside = document.querySelector(".modal-main");
    // if(modalOutside){
    //     console.log(modalOutside)
    //     modalOutside.addEventListener("hover",()=>{
    //         console.log("btn clikced")
    //     })
    // }


    // console.log(socket)
    // console.log(socket.id)

    // socket.on("hello",(args)=>{
    //     console.log(args);
    // })
    var reqPostID = 27;
    const socketConnect=()=>{
        console.log("hn")
        socket.emit("reqInteraction",reqPostID);
        socket.once("resInteraction",(args)=>{
            console.log("res:",args);
        })
        
        
    //     console.log(socket)
    //     console.log(socket.id)
    //     fetch('/socket')
    //     .then((response) => response.json())
    //     .then((data) =>{
    //         console.log(data)
    //         socket.on("hello",(args)=>{
    //                 console.log(args)
    //         })
            
    // });
    // socket.on("hello",(args)=>{
    //     console.log(args)
    // })



        // socket.on("connect",()=>{
        //     // console.log(socket)
        //     console.log(socket.id)
        //     // console.log(socket.connected)
        // })

    }



    
    return (
        <>      
        <button onClick={socketConnect}>socket-connect</button>
            {/* <h2>modal</h2> */}
            {/* <button id="modal-open" type="button" onClick={openModal}>press me</button>
            <div className="modal-main">
                <div id="modal">
                    <button id="modal-close" type="button" onClick={closeModal}> &times;</button>
                    <div className="modal-container">
                        <Post id="1" seq="60" uname="d" title="title" desc="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam repellat corporis nobis voluptatum. Distinctio voluptas ad, numquam reprehenderit facilis aspernatur?" key="1" />
                    </div>
                </div>
            </div> */}

        </>
    )
}

export default TestPage;

