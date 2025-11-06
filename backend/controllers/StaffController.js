
const bcrypt = require("bcryptjs");
const StaffModel = require("../models/SatffModel");
const UserModel = require("../models/UserModel");


const addStaff = async (req, res) => {
    console.log(req.body);
    try {
        const createdBy = req.user._id;
        const { name, email, password,role } = req.body;

        // 🔍 Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // 🔍 Check if staff already exists
        const existingStaff = await StaffModel.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ message: "Staff already exists with this email." });
        }

        const profileImage = req.file ? req.file.path : null;
        const hashedPassword = await bcrypt.hash(String(password), 10);

        const userData={
            name,
            email,
            password:hashedPassword,
            profileImage,
            role
        }

        // 🧍 Create User account (only basic info)
        const newUser = new UserModel(userData);
        await newUser.save();

        // 👨‍💼 Create Staff record (all extra info)
        const staffData = {
            ...req.body,
            profileImage,
            createdBy,
        };

        // Optional: link staff with created user
        staffData.userId = newUser._id;

        const newStaff = new StaffModel(staffData);
        await newStaff.save();

        res.status(201).json({
            success: true,
            message: "Staff added successfully",
            data: newStaff,
        });
    } catch (error) {
        console.error("Add staff error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getAllStaff=async(req,res)=>{
    try{
        let {page,limit,search,role}=req.query
        page=parseInt(page) || 1;
        limit=parseInt(limit) || 10;
        const skip=(page-1)*limit

        let searchCriteria={};
        if(search){
            searchCriteria={
                $or:[{name:{$regex:search,$options:"i"}},{email:{$regex:search,$options:"i"}}]
            }
        }
        if(role && role!=="all"){
            searchCriteria.role=role;
        }
        const totalStaff = await StaffModel.countDocuments(searchCriteria);
        const staff=await StaffModel.find(searchCriteria).skip(skip).limit(limit).sort({createdAt:-1});
        const totalPages = Math.ceil(totalStaff / limit);
        res.status(200).json({
            success:true,
            message:"Staff fetched successfully",
            totalStaff,
            staff,
            totalPages,
            currentPage:page

        })
    }catch(error){
        res.status(500).json({message:"Server Error",error:error.message})
    }
}

const getStaffById=async(req,res)=>{
    try{
        const {id}=req.params;
        const staff=await StaffModel.findById(id);
        res.status(200).json({
            success:true,
            message:"Staff fetched successfully",
            staff
        })
    }catch(error){
        res.status(500).json({message:"Server Error",error:error.message})
    }
}

module.exports = { addStaff,getAllStaff,getStaffById };
