import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

const employeeSchema = new Schema({
    resume: {
        type: String,
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
    }
});

export const Employee = User.discriminator('employee', employeeSchema);
