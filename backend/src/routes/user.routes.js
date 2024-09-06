import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getCurrentUser, getEmployeeByUsername, loginUser, logoutUser, refreshAccessToken, registerUser, updateProfilePicture, updateUser, getEmployeeById, updateEmployeeSkills } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';



const router = Router();

router.route("/register").post(upload.single("profilePicture"), registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT ,logoutUser)

router.route("/refresh-access-token").post(refreshAccessToken)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update").patch(verifyJWT,updateUser)

router.route("/update-profile-picture").patch(verifyJWT,upload.single("profilePicture"),updateProfilePicture)

router.route('/employee/:employeeId').get(verifyJWT,getEmployeeById);

router.route('/employee/username/:username').get(verifyJWT, getEmployeeByUsername);

router.route('/employee/:employeeId/skills').patch(verifyJWT,updateEmployeeSkills);


export default router;