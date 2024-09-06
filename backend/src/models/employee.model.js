import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";
import { Review } from "./review.model.js";

const employeeSchema = new Schema({
    resume: {
        type: String
    },
    atsScore: {
        type: Number,
        min: 0,
        max: 100
    },
    skills: [String],
    jobPreferences: {
        type: String
    },
    availabilityStatus: {
        type: String,
        enum: ['available', 'busy', 'not available'],
        default: 'available'
    },
    averageRating: {
        type: Number,
        default: 0
    },
    assignedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreelancingOffer',
    }],
    completedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreelancingOffer',
    }],
});

employeeSchema.methods.updateAverageRating = async function () {
    const reviews = await Review.find({ reviewee: this._id });
    if (reviews.length === 0) {
        this.averageRating = 0;
        await this.save();
        return;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / reviews.length;
    await this.save();
}

employeeSchema.methods.assignJob = function (jobId) {
    this.assignedJobs.push(jobId);
    return this.save();
};

employeeSchema.methods.completeJob = function (jobId) {
    this.completedJobs.push(jobId);
    this.assignedJobs.pull(jobId);  // Optionally remove from assignedJobs
    return this.save()
}

export const Employee = User.discriminator('employee', employeeSchema);

