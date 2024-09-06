import { FreelancingOffer } from '../models/freelancingOffer.model.js';
import { asyncHandler } from "../utils/asyncHandeler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Application } from '../models/application.model.js';
import { User } from '../models/user.model.js';

const createFrelancingOffer = asyncHandler(async (req, res) => {

    if (req.user.role !== 'employer') {
        return res.status(403).json({ error: 'Only employers can create jobs' })
    }

    const employerId = req.user._id
    const { title, description, skills, salary, duration } = req.body

    if (!title || !description || !salary) {
        return res.status(400).json({ error: 'Title, description, and salary are required', success: false })
    }

    const existingOffer = await FreelancingOffer.findOne({ title })

    if (existingOffer) {
        return res.status(400).json({ error: 'A job with this title already exists. Please choose a different title.', success: false })
    }

    const newoffer = new FreelancingOffer({
        title,
        description,
        employer: employerId,
        skills,
        salary,
        duration
    })

    await newoffer.save()

    const employer = await User.findById(employerId)
    employer.postedOffersCurrent.push(newoffer._id)
    await employer.save()


    res.status(201).json(new ApiResponse(205, newoffer, 'Job created successfully'))
})

const getFrelancingOffers = asyncHandler(async (req, res) => {
    const offers = await FreelancingOffer.find()
        .populate({
            path: 'employer',  // Path to the employer field
            select: '',  // Fields you want to include
            model: 'User',  // Explicitly state the base model (User)
        });

    //console.log(offers)

    if (offers.length === 0) {
        return res.status(404).json({ error: 'Jobs not found', success: false })
    }

    res.json(new ApiResponse(200, offers, 'Jobs retrieved successfully'))
})

const getFreelancingOfferById = asyncHandler(async (req, res) => {
    const offer = await FreelancingOffer.findById(req?.params?.id)
        .populate({
            path: 'employer',  // Path to the employer field
            select: '',  // Fields you want to include
            model: 'User',  // Explicitly state the base model (User)
        })
        .populate('assignedTo', 'username')
        .populate('applicants', 'username')

    if (!offer) {
        return res.status(404).json({ message: 'Freelancing offer not found', success: false })
    }

    return res.status(200).json(new ApiResponse(200, offer, 'Freelancing offer details fetched successfully'))
})

const getAllOfferByEmployer = asyncHandler(async (req, res) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Only employers can complete offers', success: false })
    }
    const employerId = req.user?._id

    const offers = await FreelancingOffer.find({ employer: employerId }).populate('employer', '')

    return res.status(200).json(new ApiResponse(200, offers, 'All offers fetched successfully'))
})


const getFreelancingOffersByEmployeeId = async (req, res) => {
    try {
        const { employeeID } = req.params;

        // Validate employeeID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(employeeID)) {
            return res.status(400).json({ message: 'Invalid employee ID', success: false });
        }

        // Fetch freelancing offers assigned to the provided employeeID
        const offers = await FreelancingOffer.find({
            assignedTo: employeeID
        })
        .populate({
            path: 'employer',  // Populate employer field
            select: '',  // Specify fields to include, if any
            model: 'User',  // Explicitly state the base model (User)
        })
        .populate('assignedTo', 'username')
        .populate('applicants', 'username');

        if (!offers.length) {
            return res.status(404).json({ message: 'No freelancing offers found for this employee', success: false });
        }

        return res.status(200).json(new ApiResponse(200, offers, 'Freelancing offers fetched successfully'));
    } catch (error) {
        console.error('Error fetching freelancing offers:', error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};
    

const updateOffer = asyncHandler(async (req, res) => {

    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Only employers can update offers', success: false })
    }
    const { title, description, skills, duration, salary } = req.body;
    const employerId = req?.user?._id

    // Find the offer first
    const offer = await FreelancingOffer.findById(req?.params?.id)
    if (!offer) {
        return res.status(404).json({ message: 'Freelancing offer not found', success: false })
    }

    // Authorization check
    if (!offer.employer.equals(employerId)) {
        return res.status(403).json({ message: 'You are not authorized to update this offer', success: false })
    }

    if (title) {
        offer.title = title
    }
    if (description) {
        offer.description = description
    }
    if (skills) {
        offer.skills = skills
    }
    if (salary) {
        offer.salary = salary
    }
    if (duration) {
        offer.duration = duration
    }

    await offer.save()

    return res.status(200).json(new ApiResponse(200, offer, 'Freelancing offer updated successfully'))
});


const completeOffer = asyncHandler(async (req, res) => {

    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Only employers can complete offers', success: false })
    }
    const employerId = req.user._id

    // Find the freelancing offer and populate assignedTo and applicants
    const offer = await FreelancingOffer.findById(req?.params?.id).populate('assignedTo').populate('applicants')
    if (!offer) {
        return res.status(404).json({ message: 'Freelancing offer not found', success: false })
    }

    // Check if the user is the employer of the offer
    if (!offer.employer.equals(employerId)) {
        return res.status(403).json({ message: 'You are not authorized to complete this offer', success: false })
    }

    // Check if the offer is assigned to anyone
    if (offer.status !== 'in progress') {
        return res.status(400).json({ message: 'Offer must not be already completed before marking it as completed', success: false })
    }

    // Ensure that the assigned employee has completed the task
    const assignedEmployee = offer.assignedTo
    if (assignedEmployee) {
        const application = await Application.findOne({
            freelancingOffer: req?.params?.id,
            applicant: assignedEmployee._id,
            taskStatus: 'completed'
        })
        if (!application) {
            return res.status(400).json({ message: 'Employee has not completed the task', success: false })
        }
    } else {
        return res.status(400).json({ message: 'No employee is assigned to this offer', success: false })
    }

    // Update the offer status to completed
    offer.status = 'completed'
    await offer.save()

    const employer = await User.findById(employerId)
    employer.postedOffersCurrent.pull(req?.params?.id)
    employer.postedOffersPast.push(req?.params?.id)
    await employer.save()

    return res.status(200).json(new ApiResponse(200, offer, 'Freelancing offer marked as completed'))
})

const findApplicants = asyncHandler(async (req, res) => {
    const offerId = req?.params?.id
    const offer = await FreelancingOffer.findById(offerId).populate('applicants')
    if (!offer) {
        return res.status(404).json({ message: 'Offer not found', success: false })
    }

    const applicants = await Application.find({ freelancingOffer: offerId }).populate('applicant', 'username')

    if (applicants.length === 0) {
        return res.status(404).json({ message: 'No applicants found', success: false })
    }

    return res.status(200).json(new ApiResponse(200, applicants, 'Applicants fetched successfully'))
})




export {
    createFrelancingOffer, getFrelancingOffers,
    getFreelancingOfferById, updateOffer,
    completeOffer, findApplicants,
    getAllOfferByEmployer
}