const mongoose = require("mongoose");


const applicationSchema = new mongoose.Schema({

    requestId:{ type: mongoose.Schema.Types.ObjectId,
                ref: "Request",
                required: true
     },
    helperId:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
     },
    status:{ 
        type:String, 
        required: true,
        enum:['pending','accepted', 'rejected'],
        default: 'pending'
    }}, {
        timestamps: true
    } 
)

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;