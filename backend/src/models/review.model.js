import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    freelancingOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreelancingOffer'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    },
}, { timestamps: true })

export const Review = mongoose.model('Review', reviewSchema);