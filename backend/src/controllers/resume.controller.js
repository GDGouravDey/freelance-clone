import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
const uploadResume = asyncHandler(async (req, res) => {

    const userId = req?.user._id

    const user = await User.findById(userId)
    if (user.role === 'employer') {
        return res.status(403).json({ message: "Only employees can upload resumes", })
    }

    const filePath = req?.file

    if (!filePath) {
        return res.status(400).json({
            message: "Please provide a file",
            success: false
        })
    }

    const allowedMimeType = 'application/pdf';
    if (filePath.mimetype !== allowedMimeType) {
        return res.status(400).json({
            message: "Invalid file type. Only PDF documents are allowed.",
            success: false
        });
    }

    let resume;

    if (filePath) {
        const fileUri = getDataUri(filePath);
        resume = await cloudinary.uploader.upload(fileUri);
    }

    if (!resume?.secure_url) {
        return res.status(500).json({
            message: "Failed to upload resume",
            success: false
        })
    }

    //here send the resume to the ml model

    user.resume = resume?.secure_url
    await user.save()

    return res.status(200).json(new ApiResponse(200, user, "Resume uploaded successfully"))

})



//all outputs from ml model
// const getOpfromML = asyncHandler(async (req, res) => {})


const deleteResume = asyncHandler(async (req, res) => {
    const userId = req?.user._id;

    const user = await User.findById(userId);
    if (user.role === 'employer') {
        return res.status(403).json({ message: "Only employees can delete resumes" });
    }

    if (!user.resume) {
        return res.status(404).json({
            message: "No resume found for this user",
            success: false
        });
    }

    // Remove resume URL from user profile
    user.resume = null;
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, "Resume deleted successfully"));
});
const getResume = asyncHandler(async (req, res) => {
    const userId = req?.user._id;

    const user = await User.findById(userId);

    if (user.role === 'employer') {
        return res.status(403).json({
            message: "Only employees can have resumes",
            success: false
        });
    }

    if (!user.resume) {
        return res.status(404).json({
            message: "No resume found for this user",
            success: false
        });
    }

    return res.status(200).json(new ApiResponse(200, { resume: user.resume }, "Resume retrieved successfully"));
});







export {
    getResume,
    uploadResume,
    deleteResume
}