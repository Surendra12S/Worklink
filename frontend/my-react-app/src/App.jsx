import Navbar from "./components/Navbar/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup/Signup.jsx";
import Login from "./pages/Login/Login.jsx";
import Home from "./pages/Home/Home.jsx";
import { useState } from "react";
import MyPost from "./pages/MyPost/MyPost.jsx";
import CreateRequest from "./pages/CreateRequest/CreateRequest.jsx";

function App(){

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    return(
        <div>
           <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
           <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/createRequest" element={<CreateRequest/>} />
            <Route path="/myPosts" element={<MyPost/>} />
            <Route path="/home" element={<Home/>} />
           </Routes>

        </div>
    )

}
export default App;