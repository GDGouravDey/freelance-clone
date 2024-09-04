import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { completeOffer, createFrelancingOffer, getFreelancingOfferById, getFrelancingOffers, updateOffer } from '../controllers/frelancing.controller.js';

const router = Router()

router.route('/').get(verifyJWT, getFrelancingOffers)
router.route('/get-offer/:id').get(verifyJWT, getFreelancingOfferById)

router.route('/create-offer').post(verifyJWT, createFrelancingOffer)

router.route('/update-offer/:id').patch(verifyJWT, updateOffer)

router.route('/complted-offer/:id').patch(verifyJWT, completeOffer)

export default router