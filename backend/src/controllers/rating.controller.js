import { User } from '../models/user.model.js';
import { Review } from '../models/review.model.js';
import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { FreelancingOffer } from '../models/freelancingOffer.model.js';

const rateEmployee = asyncHandler(async (req, res) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Only employers can rate employees', success: false })
    }

    const { employeeId, rating, offerId } = req.body

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5', success: false })
    }

    const employerId = req.user._id

    // Check if the employee exists
    const employee = await User.findById(employeeId)
    if (!employee || employee.role !== 'employee') {
        return res.status(404).json({ message: 'Employee not found', success: false })
    }

    // Check if the employer exists
    const employer = await User.findById(employerId)
    if (!employer || employer.role !== 'employer') {
        return res.status(404).json({ message: 'Employer not found', success: false })
    }

    // Check if the freelancing offer exists and is completed
    const offer = await FreelancingOffer.findById(offerId);
    if (!offer || offer.status !== 'completed' || offer.employer.toString() !== employerId.toString() || offer.assignedTo.toString() !== employeeId.toString()) {
        return res.status(403).json({ message: 'Offer not completed or not assigned to the employee', success: false })
    }

    // Check if a review already exists for this offer
    const existingReview = await Review.findOne({ reviewee: employeeId, reviewer: employerId, freelancingOffer: offerId })
    if (existingReview) {
        return res.status(400).json({ message: 'Review already exists for this offer', success: false })
    }

    const review = new Review({
        reviewee: employeeId,
        reviewer: employerId,
        rating,
        freelancingOffer: offerId
    })

    await review.save()

    // Calculate new average rating after adding the new review
    const reviews = await Review.find({ reviewee: employeeId });
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

    employee.averageRating = averageRating
    await employee.save()

    return res.status(201).json(new ApiResponse(201, review, 'Employee rated successfully'))
})

const deleteReview = asyncHandler(async (req, res) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Only employers can delete reviews', success: false });
    }

    const employerId = req.user._id

    // Find the review
    const review = await Review.findById(req.params.id)
    if (!review) {
        return res.status(404).json({ message: 'Review not found', success: false })
    }

    // Check if the review was written by the current user
    if (review.reviewer.toString() !== employerId.toString()) {
        return res.status(403).json({ message: 'Unauthorized to delete this review', success: false })
    }

    // Remove the review
    await Review.findByIdAndDelete(req.params.id)

    // Update employee's average rating
    const employee = await User.findById(review.reviewee)

    if (employee && employee.role === 'employee') {
        const reviews = await Review.find({ reviewee: employee._id });
        if (reviews.length > 0) {
            const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
            employee.averageRating = averageRating
        } else {
            employee.averageRating = 0; // or some default value if there are no reviews left
        }
        await employee.save()
    }

    return res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'))
});

export {
    rateEmployee,
    deleteReview
};
