import { useState } from "react";
import "./Signup.css";
import API from "../../api.js";



function Signup() {

  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
    location:""
  });

 

  function onChange(e){
    setFormData({...formData,[e.target.name] : e.target.value});
  }
  
  async function onSubmit(e){
    e.preventDefault();

    try{
         const response = await API.post('/api/users/signup', formData);
          alert("Signup Successfull!");
          console.log("User Data", response.data);
    }catch(error){
       const errorMsg = error.response?.data?.message || "Something went wrong";
      alert(errorMsg);
      console.error("Signup Error:", errorMsg);
    }
  };

  return (
    <div className="signupWrapper">
      <div className="signupCard">
        <h2>Create Account</h2>

        <form className="formContainer" onSubmit={onSubmit} >
          <input type="text" placeholder="Full Name" name="name" value={formData.name} onChange={onChange}/>
          <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={onChange} />
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={onChange} />
          <input type="text" placeholder="Enter Your Location" name="location" value={formData.location} onChange={onChange} />
           <div className="policy-agreementContainer" >
            <input type="checkbox" />
            <p>By continuing, i agree to the trems of use & privacy policy.</p>
           </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
