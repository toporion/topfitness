const EnrollmentModel = require("../models/EnrollModel");
const FeaturedClassModel = require("../models/FeaturedClassModel");
const NutritionPlan = require("../models/NutritionPlan");
const StaffModel = require("../models/SatffModel");
const UserModel = require("../models/UserModel");
const { sendEmail } = require("../services/EmailService");

const createNutritionPlan = async (req, res) => {
    console.log("Creating a new nutrition plan", req.body);
    try {
        // 1. Get the raw data from the form
        const { planName, client, planDetails: planDetailsString, generalNotes, status } = req.body;
        const trainerId = req.user.id;

        // 2. Validation
        if (!planName || !client) {
            return res.status(400).json({ error: 'planName and client are required' });
        }

        const foodImage = req.file ? req.file.path : null;

        // 3. Check if client exists
        const existingClient = await UserModel.findById(client);
        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // ✅ --- THIS IS THE FIX ---
        // Parse the 'planDetails' string back into an array
        const planDetails = JSON.parse(planDetailsString);
        // ✅ --- END OF FIX ---

        // 4. Create nutrition plan
        const newNutritionPlan = new NutritionPlan({
            planName,
            client,
            trainer: trainerId,
            planDetails, // This is now a proper array
            generalNotes,
            status,
            foodImage
        });

        // 5. Save the plan
        await newNutritionPlan.save();

        // 6. Send notification email (as planned)
        try {
            const trainer = await UserModel.findById(trainerId);
            const subject = `New Nutrition Plan from ${trainer.name}!`;
            const html = `
                <h1>Your New Nutrition Plan is Ready!</h1>
                <p>Hi ${existingClient.name},</p>
                <p>Your trainer, ${trainer.name}, has just created a new nutrition plan for you: <strong>${planName}</strong>.</p>
                <p>Log in to your dashboard to view the full details.</p>
            `;
            sendEmail(existingClient.email, subject, html);
        } catch (emailError) {
            console.error("Email notification failed:", emailError);
        }

        // 7. Send success response
        res.status(201).json({
            message: 'Nutrition plan created successfully',
            nutritionPlan: newNutritionPlan
        });

    } catch (error) {
        console.error("Error creating nutrition plan:", error.message);
        res.status(500).json({ error: 'Failed to create nutrition plan' });
    }
};

/**
 * HELPER: Gets a list of a trainer's *own* clients (from enrollments)
 * and filters them by a search term.
 */
const getMyEnrolledClients = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const searchQuery = req.query.search || ''; // Get search term from query

        // --- Step 1: Find Trainer's Staff ID ---
        const staffMember = await StaffModel.findOne({ userId: loggedInUserId });
        if (!staffMember) {
            console.log("No matching staff profile found for this user.");
            return res.status(200).json({ success: true, data: [] });
        }
        const staffId = staffMember._id;

        // --- Step 2: Find Trainer's Classes ---
        const trainerClasses = await FeaturedClassModel.find({ trainer: staffId }).select('_id');
        const classIds = trainerClasses.map(cls => cls._id);

        if (classIds.length === 0) {
            console.log("Trainer has no classes.");
            return res.status(200).json({ success: true, data: [] });
        }

        // --- Step 3: Find Enrolled Client IDs ---
        const enrollments = await EnrollmentModel.find({ classId: { $in: classIds } }).select('userId');

        // Get a unique list of client User IDs
        const clientUserIds = [...new Set(enrollments.map(e => e.userId))];

        if (clientUserIds.length === 0) {
            console.log("Trainer has no clients enrolled in their classes.");
            return res.status(200).json({ success: true, data: [] });
        }

        // --- Step 4: Search for Clients by Name/Email ---
        // Build the final search query
        const finalQuery = {
            _id: { $in: clientUserIds }, // Must be in the trainer's client list
            role: 'client' // Must be a client
        };

        if (searchQuery) {
            finalQuery.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const clients = await UserModel.find(finalQuery)
            .select('name email profileImage _id') // Send only what's needed
            .limit(10); // Limit to 10 results for performance

        res.status(200).json({ success: true, data: clients });

    } catch (error) {
        console.error("Error fetching trainer's clients:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getNutritionPlans = async (req, res) => {
    try{
        const {role, id: userId} = req.user;
        let plans=[];

        if(role === 'client'){
            plans =await NutritionPlan.find({client:userId}).populate('trainer','name email profileImage')
            .sort({createdAt:-1});
        }
        else if(role ==='trainer'){
            plans =await NutritionPlan.find({trainer:userId}).populate('client','name email profileImage')
            .sort({createdAt:-1});
        }
        else if(role ==='admin'){
            plans =await NutritionPlan.find().populate('client','name email profileImage')
            .populate('trainer','name email profileImage')
            .sort({createdAt:-1});
        }
        res.status(200).json({success:true, data:plans});

    }catch(error){
        console.error("Error fetching nutrition plans:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const getNutritionPlanById = async (req, res) => {
    try{

        const {id:planId} = req.params;
        const {role, id: userId} = req.user;
        const plan =await NutritionPlan.findById(planId)
        .populate('client','name email profileImage')
        .populate('trainer','name email profileImage')
        if(!plan){
            return res.status(404).json({success:false, message:"Nutrition Plan not found"});
        }
        // 2. --- Security Check ---
        // Allow if:
        // a) The user is an admin
        // b) The user is the client this plan is for
        // c) The user is the trainer who made this plan
        const isAuthorized =
        role === 'admin' ||
        plan.client._id.toString() === userId ||
        plan.trainer._id.toString() === userId;
        if(!isAuthorized){
            return res.status(403).json({success:false, message:"You are not authorized to view this nutrition plan"});
        }
        res.status(200).json({success:true, data:plan});
    }catch(error){
        console.error("Error fetching nutrition plan by ID:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports = {
    createNutritionPlan,
    getMyEnrolledClients,
    getNutritionPlans,
    getNutritionPlanById
};