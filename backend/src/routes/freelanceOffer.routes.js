import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { completeOffer, createFrelancingOffer, findApplicants, getFreelancingOfferById, getFrelancingOffers, updateOffer, getAllOfferByEmployer } from '../controllers/frelancing.controller.js';

const router = Router()

router.route('/').get(verifyJWT, getFrelancingOffers)
router.route('/get-offer/:id').get(verifyJWT, getFreelancingOfferById)

router.route('/create-offer').post(verifyJWT, createFrelancingOffer)

router.route('/update-offer/:id').patch(verifyJWT, updateOffer)

router.route('/complted-offer/:id').patch(verifyJWT, completeOffer)

router.route('/find-applicants/:id').get(verifyJWT, findApplicants)

router.route('/find-all-jobs').get(verifyJWT,getAllOfferByEmployer)

export default router