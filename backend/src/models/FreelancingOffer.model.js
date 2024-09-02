import mongoose,{Schema} from "mongoose";

const freelancingOfferSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
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
      skills: [{
        type: String
      }],
      budget: {
        type: Number,
        required: true
      },
      duration: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['open', 'assigned', 'completed'],
        default: 'open'
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
      }],
},{timestamps:true})

export const FreelancingOffer = mongoose.model('FreelancingOffer',freelancingOfferSchema);