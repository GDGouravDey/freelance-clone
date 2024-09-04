import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    freelancingOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreelancingOffer',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
}, { timestamps: true });

export const Review = mongoose.model('Review', reviewSchema);
