import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

const employerSchema = new Schema({
    companyName: {
        type: String
    },
    industry: {
        type: String
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501+']
    },
    postedOffersCurrent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreelancingOffer'
    }],
    postedOffersPast: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreelancingOffer'
    }],
    //average rating of the employer gives by employees
    averageRating: {
        type: Number,
        default: 0
    }
})


employerSchema.methods.assignJob = function (jobId) {
    this.postedOffersCurrent.push(jobId);
    return this.save();
};

employerSchema.methods.completeJob = function (jobId) {
    this.postedOffersCurrent.push(jobId);
    this.postedOffersPast.pull(jobId);  
    return this.save()
}

export const Employer = User.discriminator('employer', employerSchema)