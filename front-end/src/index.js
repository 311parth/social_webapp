import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function delete_cookie(name) {
  document.cookie = name +'=; Path=/localhost:3000; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

if(window.sessionStorage.getItem("islogged")===null){
    window.sessionStorage.setItem("islogged","0");
    console.log("Set 0")
}

// window.unload = function(){
//   delete_cookie("secret");
//   delete_cookie("uname");
// };



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

