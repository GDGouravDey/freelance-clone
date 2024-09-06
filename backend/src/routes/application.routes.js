import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { acceptApplication, applyForOffer, completeTask, rejectApplication, getAllAppliedOffer } from '../controllers/application.controller.js';

const router = Router()

router.route('/apply/:id').post(verifyJWT, applyForOffer)

router.route('/accept-application').post(verifyJWT, acceptApplication)

router.route('/reject-application').post(verifyJWT, rejectApplication)

router.route('/complete-offer').post(verifyJWT, completeTask)

router.route('/get-appliedJob').get(verifyJWT, getAllAppliedOffer)

export default router