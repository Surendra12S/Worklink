require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/authRoutes.js")
const cors = require("cors");
const requestRoutes = require("./routes/requestRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/users",userRoutes);
app.use("/api/requests",requestRoutes);

app.get("/",(req,res)=>{
    res.send("skfgsd");
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})