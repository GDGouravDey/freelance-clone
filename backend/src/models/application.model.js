import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
    freelancingOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreelancingOffer'
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    proposedRate: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    taskStatus: { 
        type: String,
        enum: ['assigned', 'completed'],
    }
})

export const Application = mongoose.model('Application', applicationSchema)