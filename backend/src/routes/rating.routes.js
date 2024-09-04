import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteReview, rateEmployee } from "../controllers/rating.controller.js";

const router = Router();

router.route("/rate").post(verifyJWT, rateEmployee);

router.route('/delete/:id').delete(verifyJWT, deleteReview);

export default router;