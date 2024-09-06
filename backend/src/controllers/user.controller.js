import { User } from '../models/user.model.js';
import { Employee } from '../models/employee.model.js';
import { Employer } from '../models/employer.model.js';
import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import mongoose from 'mongoose';


const generateAccessTokenAndRefreshTokens = async (userId) => {
    try {

        const user = await User.findById(userId) //now the the user obj is available

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        //generating access token and refresh token
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //saving the refresh token in db
        user.refreshToken = refreshToken
        //validateBeforeSave : false - to avoid validation error
        await user.save({ validateBeforeSave: false })


        //user ke diye dilam
        return { accessToken, refreshToken }


    } catch (error) {

        console.log(error)
    }

}

const getEmployeeById = async (req, res) => {
    try {
        const { employeeId } = req.params;

        // Validate employeeId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        var id = new mongoose.Types.ObjectId(employeeId);
        const employee = await User.findOne({ _id: id });


        console.log(employee);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee); // Send the employee details
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



const getEmployeeByUsername = async (req, res) => {
    try {
        const { username } = req.params; 
        console.log(username);
        
        const employee = await User.findOne({ username, __t: 'Employee' });
        console.log(2);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        console.log(3);
        res.json(employee); // Send the employee details
    } catch (error) {
        console.error('Error fetching employee by username:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateEmployeeSkills = async (userId, newSkills) => {
    try {
        console.log('Incoming newSkills:', JSON.parse(newSkills.skills));
        console.log("Hello");
        
        if (!Array.isArray(newSkills.skills)) {
            throw new Error('Skills should be an array');
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            userId,
            { $set: { skills: newSkills.skills } },
            { new: true }  
        );

        if (!updatedEmployee) {
            console.log('Employee not found');
            return;
        }

        console.log('Updated Employee:', updatedEmployee);
    } catch (error) {
        console.error('Error updating employee skills:', error);
    }
};


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    // Check if the username or email already exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        return res.status(400).json({ message: "Username or Email already exists" });
    }

    let user;
    if (role === 'freelancer') {
        user = new Employee({ username, email, password, role });
    } else if (role === 'employer') {
        user = new Employer({ username, email, password, role });
    } else {
        return res.status(400).json({ message: 'Choose your correct role from the dropdown', success: false });
    }

    await user.save();

    if (!user) {
        return res.status(401).json({ message: 'User not created', success: false });
    }

    const createdUser = await User.findById(user._id).select('-password -refreshToken');
    if (!createdUser) {
        return res.status(401).json({ message: 'User not created successfully', success: false });
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user._id)

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: createdUser,
        accessToken,
        refreshToken
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password', success: false })
    }

    const user = await User.findOne({ email })

    //console.log("login user",user)


    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials', success: false })
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials', success: false })
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    const options = {
        httpOnly: true,
        secure: false,
        sameSite: 'None'
    }

    return res.status(200).cookie('refreshToken', refreshToken, options).cookie('accessToken', accessToken, options).json(
        new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, 'User logged in successfully')
    )


})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req?.user._id,
        {
            $unset: {
                refreshToken: 1 //remove the field
            }

        },
        {
            new: true
        }
    )

    //2

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
        new ApiResponse(200, {}, "User logged out")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken


    console.log("Cookies:", req.cookies);
    console.log("Request Body:", req.body)
    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "No refresh token provided", success: false })

    }

    console.log("incomingRefreshToken", incomingRefreshToken)
    console.log("process.env.REFRESH_TOKEN_SECRET", process.env.REFRESH_TOKEN_SECRET)
    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        console.log("decodedToken", decodedToken)


        const user = await User.findById(decodedToken?._id)

        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({ message: "Invalid refresh token", success: false });
        }

        //console.log("user", user)



        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshTokens(user._id)

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
            new ApiResponse(200),
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed successfully"

        )
    } catch (error) {
        return res.status(401).json({ message: error.message })


    }









})

const getCurrentUser = asyncHandler(async (req, res) => {
    console.log("req.user", req.user)
    return res.status(200).json(
        new ApiResponse(200, req.user, "current user fetched successfully")

    )
})

const updateUser = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const updates = req.body

    // Find user by ID
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    // Define allowed fields based on user role
    let allowedUpdates = ['username', 'email', 'password']

    if (user.role === 'employee') {
        allowedUpdates = allowedUpdates.concat(['skills', 'jobPreferences', 'availabilityStatus'])
    } else if (user.role === 'employer') {
        allowedUpdates = allowedUpdates.concat(['companyName', 'industry', 'companySize'])
    }

    // Filter updates based on allowed fields
    const filteredUpdates = Object.keys(updates).reduce((obj, key) => {
        if (allowedUpdates.includes(key)) {
            obj[key] = updates[key]
        }
        return obj;
    }, {})

    // Update user with filtered fields
    Object.assign(user, filteredUpdates)

    // Hash password if it's being updated
    if (filteredUpdates.password) {
        user.password = await bcrypt.hash(filteredUpdates.password, 10)
    }

    // Save the updated user
    await user.save()

    return res.status(200).json(new ApiResponse(204, user, 'User updated successfully'))
})

const updateProfilePicture = asyncHandler(async (req, res) => {
    const userId = req?.user?._id
    const filePath = req?.file

    if (!filePath) {
        return res.status(400).json({ message: 'Please provide a file' })
    }

    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    const fileUri = getDataUri(filePath)
    let profilePicture

    if (filePath) {
        const fileUri = getDataUri(filePath);
        profilePicture = await cloudinary.uploader.upload(fileUri);
    }

    if (!profilePicture?.secure_url) {
        return res.status(500).json({
            message: "Failed to upload profile picture",
            success: false
        })
    }

    user.profilePicture = profilePicture?.secure_url
    await user.save()

    return res.status(200).json(new ApiResponse(200, user, 'Profile picture updated successfully'))

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateUser,
    updateProfilePicture,
    getEmployeeById,
    updateEmployeeSkills,
    getEmployeeByUsername
}
