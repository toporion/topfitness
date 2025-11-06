const WorkoutPlan = require("../models/WorkoutPlanModel");
const UserModel = require("../models/UserModel");
const { sendEmail } = require("../services/EmailService");

// --- 1. CREATE (The function you built) ---
const createWorkoutPlan = async (req, res) => {
    try {
        const { planName, client, planDetails: planDetailsString, generalNotes, status } = req.body;
        const trainerId = req.user.id;
        
        if (!planName || !client) {
            return res.status(400).json({ error: 'planName and client are required' });
        }
        const workoutImage = req.file ? req.file.path : null;

        const existingClient = await UserModel.findById(client);
        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const planDetails = planDetailsString ? JSON.parse(planDetailsString) : [];

        const newWorkoutPlan = new WorkoutPlan({
            planName,
            client,
            trainer: trainerId,
            planDetails, 
            generalNotes,
            status,
            workoutImage
        });
        
        await newWorkoutPlan.save();
        
        // Send notification email
        try {
            const trainer = await UserModel.findById(trainerId);
            const subject = `New Workout Plan from ${trainer.name}!`;
            const html = `
                <h1>Your New Workout Plan is Ready!</h1>
                <p>Hi ${existingClient.name},</p>
                <p>Your trainer, ${trainer.name}, has just created a new workout plan for you: <strong>${planName}</strong>.</p>
                <p>Log in to your dashboard to view the full details.</p>
            `;
            sendEmail(existingClient.email, subject, html);
        } catch (error) {
            console.error("Email notification failed:", error);
        }
        
        res.status(201).json({ success: true, message: 'Workout plan created successfully', data: newWorkoutPlan });

    } catch (error) {
        console.error("Error creating workout plan:", error.message);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// --- 2. GET ALL PLANS (Role-Based) ---
const getWorkoutPlans = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        let plans = [];

        // --- Case 1: CLIENT ---
        // Find only plans *assigned to* this client
        if (role === 'client') {
            plans = await WorkoutPlan.find({ client: userId })
                .populate('trainer', 'name email profileImage') // Show trainer's info
                .sort({ createdAt: -1 });
        }
        
        // --- Case 2: TRAINER ---
        // Find only plans *created by* this trainer
        else if (role === 'trainer' || role === 'staff') {
            plans = await WorkoutPlan.find({ trainer: userId })
                .populate('client', 'name email profileImage') // Show client's info
                .sort({ createdAt: -1 });
        }
        
        // --- Case 3: ADMIN ---
        // Find *all* plans
        else if (role === 'admin' || role === 'manager') {
            plans = await WorkoutPlan.find({})
                .populate('client', 'name email')
                .populate('trainer', 'name email')
                .sort({ createdAt: -1 });
        }

        res.status(200).json({ success: true, data: plans });

    } catch (error) {
        console.error("Error fetching workout plans:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// --- 3. GET ONE PLAN BY ID (With Security) ---
const getWorkoutPlanById = async (req, res) => {
    try {
        const { id: planId } = req.params; // The ID of the plan from the URL
        const { role, id: userId } = req.user; // The logged-in user

        // 1. Find the plan and populate both client/trainer
        const plan = await WorkoutPlan.findById(planId)
            .populate('client', 'name email profileImage')
            .populate('trainer', 'name email profileImage');

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        // 2. --- Security Check ---
        const isAuthorized = 
            role === 'admin' ||
            role === 'manager' ||
            plan.client._id.toString() === userId || 
            plan.trainer._id.toString() === userId;

        if (!isAuthorized) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to view this plan." });
        }

        // 3. If authorized, send the plan
        res.status(200).json({ success: true, data: plan });

    } catch (error) {
        console.error("Error fetching single workout plan:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createWorkoutPlan,
    getWorkoutPlans,
    getWorkoutPlanById
};
