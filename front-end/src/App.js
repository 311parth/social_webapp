import  './main.css'

import { BrowserRouter, Routes, Route , Link} from "react-router-dom";
import HomePage from './components/pages/HomePage';
import SignupPage from './components/pages/SignupPage';
import LoginPage from './components/pages/LoginPage';
import PostPage from './components/pages/PostPage';
import LogoutPage from './components/pages/LogoutPage';
import SelfProfilePage from './components/pages/SelfProfilePage';
import ProfilePage from './components/pages/ProfilePage';
import PostViewPage from './components/pages/PostViewPage';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>}></Route>
          <Route path="/home"  element={<HomePage/>}></Route>
    
          <Route path="/signup" element={<SignupPage/>}></Route>
          <Route path="/login" element={<LoginPage/>}></Route>
          <Route path="/post" element={<PostPage/>}></Route>

          <Route path="/logout" element={<LogoutPage/>}></Route>
          <Route path="/profile" element={<SelfProfilePage/>}></Route>
          <Route path="/user" element={<ProfilePage/>}></Route>
          <Route path="home/post/view/:id" element={<PostViewPage/>}></Route>


        </Routes>
    </BrowserRouter>
  );
}

export default App;
