const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const ClientModel = require("../models/ClientModel");

const createClient = async (req, res) => {
    try {
        const { name, email, password, address, gender, age, phone } = req.body;
        console.log(req.body);
        const profileImage = req.file ? req.file.path : null;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            if (existingUser.role === "client") {
                return res.status(400).json({
                    success: true,
                    message: "Client already exists with this email.",
                    userId: existingUser._id
                });
            }

            if (existingUser.role === "user") {
                existingUser.role = "client";
                await existingUser.save();

                const clientData = {
                    name,
                    email,
                    password: await bcrypt.hash(String(password), 10),
                    address,
                    gender,
                    age,
                    phone,
                    userId: existingUser._id,
                    createdBy: req.user?._id,
                    profileImage
                }

                const client = new ClientModel(clientData);
                await client.save();
                res.status(201).json({
                    success: true,
                    message: "Client created successfully",
                    data: client
                });
            }

        }

        const hashedPassword = await bcrypt.hash(String(password), 10);

        const userdata = {
            name,
            email,
            password: hashedPassword,
            profileImage, role: "client"
        }

        const user = new UserModel(userdata);
        await user.save();

        const clientData = {
            name,
            email,
            password: hashedPassword,
            address,
            gender,
            age,
            phone,
            userId: user._id,
            createdBy: req.user? req.user._id : null,
            profileImage
        }

        const newClient= new ClientModel(clientData);
        await newClient.save();
        res.status(201).json({
            success: true,
            message: "Client created successfully",
            data: newClient
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports = { createClient }