import { FreelancingOffer } from '../models/freelancingOffer.model.js';
import { Application } from '../models/application.model.js';
import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

const applyForOffer = asyncHandler(async (req, res) => {

    if (req.user.role !== 'employee') {
        return res.status(403).json({ message: 'Only employees can apply for jobs', success: false });
    }

    const freelancingOfferId = req?.params?.id
    const { proposedRate } = req.body
    const applicantId = req.user._id


    //Check if the employee has already applied for this offer
    const existingApplication = await Application.findOne({
        freelancingOffer: freelancingOfferId,
        applicant: applicantId
    });

    if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this offer', success: false })
    }


    // Create a new application
    const application = await Application.create({
        freelancingOffer: freelancingOfferId,
        applicant: applicantId,
        proposedRate
    });

    // Add the application to the freelancing offer
    await FreelancingOffer.findByIdAndUpdate(freelancingOfferId, {
        $push: { applicants: application._id }
    });

    res.status(201).json(new ApiResponse(201, application, 'Application submitted successfully'))
});

const acceptApplication = asyncHandler(async (req, res) => {

    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Only employers can accept applications', success: false })
    }
    const { applicationId, freelancingOfferId } = req.body
    const employerId = req.user._id

   // Validate ObjectId format
   if (!mongoose.Types.ObjectId.isValid(applicationId) || !mongoose.Types.ObjectId.isValid(freelancingOfferId)) {
    return res.status(400).json({ message: 'Invalid ObjectId', success: false });
   }

    // Find the freelancing offer
    const offer = await FreelancingOffer.findById(freelancingOfferId);
    if (!offer) {
        return res.status(404).json({ message: 'Freelancing offer not found', success: false })
    }

    // Check if the user is the employer of the offer
    if (!offer.employer.equals(employerId)) {
        return res.status(403).json({ message: 'You are not authorized to accept applications for this offer', success: false })
    }

    // Find the application
    const application = await Application.findById(applicationId)
    if (!application || !application.freelancingOffer.equals(freelancingOfferId)) {
        return res.status(404).json({ message: 'Application not found for this offer', success: false })
    }

    if(application.status === 'accepted') {
        return res.status(400).json({ message: 'Application already accepted', success: false })
    }
    // Update the offer to assign the employee and change status to 'in progress'
    offer.assignedTo = application.applicant
    offer.status = 'in progress'
    await offer.save()



    // Update the application status to 'accepted'
    application.status = 'accepted'
    application.taskStatus = 'assigned'
    await application.save()

    const employeeId = application.applicant
    const employee = await User.findById(employeeId)
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found', success: false })
    }

    // console.log('Employee:', employee);
    employee.assignedJobs.push(freelancingOfferId)
    await employee.save()
    res.status(200).json(new ApiResponse(200, offer, 'Application accepted and employee assigned to the offer'))

})

const rejectApplication = asyncHandler(async (req, res) => {

    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Only employers can reject applications', success: false })
    }
    const { applicationId, freelancingOfferId } = req.body
    const employerId = req.user._id

    // Find the freelancing offer
    const offer = await FreelancingOffer.findById(freelancingOfferId)
    if (!offer) {
        return res.status(404).json({ message: 'Freelancing offer not found', success: false })
    }

    // Check if the user is the employer of the offer
    if (!offer.employer.equals(employerId)) {
        return res.status(403).json({ message: 'You are not authorized to reject applications for this offer', success: false })
    }

    // Find the application
    const application = await Application.findById(applicationId);
    if (!application || !application.freelancingOffer.equals(freelancingOfferId)) {
        return res.status(404).json({ message: 'Application not found for this offer', success: false })
    }

    // Update the application status to 'rejected'
    application.status = 'rejected'
    await application.save()

    res.status(200).json(new ApiResponse(200, application, 'Application rejected successfully'));
})


const completeTask = asyncHandler(async (req, res) => {

    if (req.user.role !== 'employee') {
        return res.status(403).json({ message: 'Only employees can complete tasks', success: false })
    }

    const { applicationId, freelancingOfferId } = req.body;
    const employeeId = req.user._id

    // Find the application
    const application = await Application.findById(applicationId);
    if (!application || !application.freelancingOffer.equals(freelancingOfferId)) {
        return res.status(404).json({ message: 'Application not found for this offer', success: false })
    }

    // Check if the user is the assigned employee for this application
    if (!application.applicant.equals(employeeId)) {
        return res.status(403).json({ message: 'You are not authorized to complete this task', success: false })
    }

    // Update the task status to 'completed'
    application.taskStatus = 'completed'
    await application.save()


    const employee = await User.findById(employeeId)
    employee.assignedJobs.pull(freelancingOfferId)
    employee.completedJobs.push(freelancingOfferId)
    await employee.save()


    res.status(200).json(new ApiResponse(200, application, 'Task completed successfully'))
})



export { applyForOffer, acceptApplication, rejectApplication, completeTask };