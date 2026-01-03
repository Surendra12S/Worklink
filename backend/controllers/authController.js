const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Signup = async (req,res) =>{

    try{
    const { name,email,password,location } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({message: "User already exists"});
    }



    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        location
    })

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1d' }
    );
    
    res.status(200).json({
        message: "User created successfully",
        token,
        user:{
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
    }catch(error){
     res.status(500).json({ message: error.message });
    }
};


const Login = async (req,res)=>{

    try{
    const { email,password } = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({ message: "Invalid Creadentials"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

   const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    // 4. Send success response
    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
 }catch(error){
     res.status(500).json({ message: error.message });
 }
}; 

module.exports = { Signup, Login };