
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
    workoutType: { type: String, enum: ['Cardio', 'Strength', 'HIIT', 'Flexibility', 'Rest Day'], required: true },
    details: { type: String },
}, { _id: false });


const workoutPlanSchema = new Schema({
    planName: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    planDetails: [WorkoutSchema],
    generalNotes: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    workoutImage: { type: String }


}, { timestamps: true });

module.exports = mongoose.model('workoutPlans', workoutPlanSchema);