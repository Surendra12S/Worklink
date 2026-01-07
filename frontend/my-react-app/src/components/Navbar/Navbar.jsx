import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";



function Navbar({ isLoggedIn, setIsLoggedIn }){

    const navigate = useNavigate();

    const handleLogout = () =>{

        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("./login");

    }

    return(
        <div className="navbarContainer" >
             <Link to={"/"} ><h1>Worklink</h1></Link> 
            <ul className="navbarList" >
                <li>How it Work</li>
                {isLoggedIn ? (
                    <>
                    <Link to={"/home"} ><li>Home</li></Link>
                    <Link to={"/createRequest"} ><li>Post Request</li></Link>
                   <Link to={"/myPosts"} ><li>My Posts</li></Link> 
                   <Link to={"/myApplications"} ><li>My Applications</li></Link> 
                    <li onClick={handleLogout} >Logout</li>
                    </>
                ) : (
                    <>
                     <Link to="/login" ><li>Login</li></Link>
                       <Link to="/signup"><li>Signup</li></Link>
                    </>
                )}
               
            </ul>
        </div>
    )
}
export default Navbar;