import mongoose, { Schema } from 'mongoose';

const freelancingOfferSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skills: [String],
    minSalary: {
        type: Number,
        required: true
    },
    maxSalary: {
        type: Number,
        required: true
    },
    finalSalary: {
        type: Number
    },
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'in progress' ,'completed'],
        default: 'available'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }]
}, { timestamps: true });

export const FreelancingOffer = mongoose.model('FreelancingOffer', freelancingOfferSchema);
