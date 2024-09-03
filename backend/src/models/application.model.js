import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
    freelancingOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreelancingOffer'
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proposedRate: {
        type: Number
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
        enum: ['not started', 'completed'],
        default: 'not started'
    }
})

export const Application = mongoose.model('Application', applicationSchema)