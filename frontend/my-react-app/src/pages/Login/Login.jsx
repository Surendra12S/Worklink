import { useState } from "react";
import "./Login.css";
import API from "../../api.js";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }){

    const [formData,setFormData] = useState({
        email:"",
        password:""
    });

    const navigate = useNavigate();

   function onChange(e){
     setFormData({...formData,[e.target.name]: e.target.value});
   }

   async function onSubmit(e){
     e.preventDefault();
     
     try{
         const response = await API.post("/api/users/login", formData);
 
          localStorage.setItem("token", response.data.token);

             setIsLoggedIn(true); 
              alert("Welcome Back");
              navigate("/");
     }catch(error){
         alert(error.response?.data?.message || "Login failed");
         console.error(error);
        }
   }

    return(
        <div className="loginWrapper" >
        <div className="loginCard" >
            <h2>Login</h2>
            <form className="loginFormConatainer" onSubmit={onSubmit}>
                <div>
                <input placeholder="Enter Your Email" name="email" value={formData.email} onChange={onChange} />
                <input placeholder="Enter Your Password" type="password" name="password" value={formData.password} onChange={onChange} />
                </div>
                <button type="submit" >Login</button>
            </form>
        </div>
         </div>
    )

}
export default Login;