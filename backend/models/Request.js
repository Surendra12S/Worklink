const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    title:{ type:String , required:true },
    description:{ type:String, required:true },
    category:{ type:String, required:true },
    location:{ type:String, required:true },
    status:{ 
        type: String,
        enum: ["open", "in_progress", "completed"],
        default:"open"
     },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    } },{
         timestamps:true
    
})

const Request = mongoose.model("Request",requestSchema);

module.exports = Request;