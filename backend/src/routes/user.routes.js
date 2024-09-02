import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUser } from '../controllers/user.controller.js';



const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT ,logoutUser)

router.route("/refresh-access-token").post(refreshAccessToken)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update").patch(verifyJWT,updateUser)



export default router;