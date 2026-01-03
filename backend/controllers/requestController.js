const Request = require("../models/Request.js");


const createRequest = async (req,res)=>{

    try{
    const { title,description,category,location} = req.body;

    if(!title || !description || !category || !location){
        return res.status(400).json({message : "All fields are required"});
    }

    const savedRequest = await Request.create({
        title,
        description,
        category,
        location,
        createdBy: req.user.id
    });

    res.status(201).json({
        message: "Request created successfully",
        data: savedRequest
    });

 }catch(error){
    console.log("Error creating request:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
 }

}

const getMyRequests = async (req,res) =>{

try{

const requests = await Request.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
res.status(200).json(requests);
}catch(error){
    console.log("Error featching my post", error.message);
    res.status(500).json({message: "Server Error", error: error.message });
}
}

const getHomeRequest = async (req,res)=>{
    try{
        const requests = await Request.find({
            status:"open",
            createdBy: { $ne: req.user.id }
        }).sort({ createdAt: -1 }).select("title category location status createdAt");

        res.status(200).json(requests);
    }catch(error){
        console.error("Home Feed Error:", error.message);
        res.status(500).json({ message: "Failed to fetch feed", error: error.message });
    }
};


module.exports = { createRequest, getMyRequests, getHomeRequest };