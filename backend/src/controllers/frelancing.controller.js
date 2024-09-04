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
            select: 'username companyName',  // Fields you want to include
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
        .populate({ path: 'employer',  // Path to the employer field
            select: 'username companyName',  // Fields you want to include
            model: 'User',  // Explicitly state the base model (User)
            })
        .populate('assignedTo', 'username')
        .populate('applicants', 'username')

    if (!offer) {
        return res.status(404).json({ message: 'Freelancing offer not found', success: false })
    }

    return res.status(200).json(new ApiResponse(200, offer, 'Freelancing offer details fetched successfully'))
})

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




export {
    createFrelancingOffer, getFrelancingOffers,
    getFreelancingOfferById, updateOffer,
    completeOffer

}