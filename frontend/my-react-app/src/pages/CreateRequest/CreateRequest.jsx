import { useState } from "react";
import "./CreateRequest.css";
import API from "../../api.js";

function CreateRequest(){

    const [RequestFormData,setRequestFormData] = useState({
        title:"",
        description:"",
        category:"",
        location:""
    });

    function handleOnChange(e){
      setRequestFormData({...RequestFormData, [e.target.name]: e.target.value});
    }

    async function handleOnSubmit(e){
         e.preventDefault();
         
         try{
            const response = await API.post("/api/requests", RequestFormData,{
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            if(response.status === 201 || response.status === 200){
                alert("Request Posted Successfully!");
            } 

            }
         catch(err){
                   const errorMessage = err.response?.data?.message || "Somthing went wrong";
                   alert(errorMessage);
         }

    }
    
    return(
        <div className="createRequestWrapper" >
        <div className="createRequrestCard">
            <h2>Create Request</h2>
        <form onSubmit={handleOnSubmit} className="CreatRequestformContainer" >
            <input placeholder="Enter Post Title" name="title" value={RequestFormData.title} onChange={handleOnChange} />
            <textarea placeholder="Enter Post Description" name="description" value={RequestFormData.description} onChange={handleOnChange} ></textarea>
            <select  name="category" value={RequestFormData.category} onChange={handleOnChange}>
                <option>Select The Category</option>
                <option>Electronics</option>
                <option>Education</option>
                <option>Home Services</option>
                <option>Delivery</option>
                <option>Repairs</option>
                <option>Other</option>
            </select>
            <input placeholder="Enter Your Location" name="location" value={RequestFormData.location} onChange={handleOnChange}/>
            <button type="submit" >Submit</button>
        </form>
    </div>
    </div>
    )
}
export default CreateRequest;