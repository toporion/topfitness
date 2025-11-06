const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and Password are required"})
        }
        const user=await UserModel.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"})
        }
        const profileImage=req.file?req.file.path:null;
        const hashedPassword=await bcrypt.hash(String(password),10);
        const newUser =new UserModel({
            ...req.body,
            password:hashedPassword,
            profileImage
        });
        await newUser.save();
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:newUser
        })
    }catch(error){
        res.status(500).json({message:"Server Error"})

    }
}
const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and Password are required"})
        }
        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const isMatch=await bcrypt.compare(String(password),user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const jwtToken=jwt.sign({id:user._id,role:user.role,email:user.email,name:user.name,profileImage:user.profileImage},process.env.JWT_SECRET);
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            jwtToken,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                profileImage:user.profileImage
            }
        })
    }catch(error){
        res.status(500).json({message:"Server Error"})
    }
}
module.exports={registerUser,loginUser};