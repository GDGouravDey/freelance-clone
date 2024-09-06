import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { deleteResume, uploadResume, getResume } from '../controllers/resume.controller.js';

const router = Router()


router.route("/upload-resume").patch(verifyJWT,upload.single("resume"), uploadResume)

router.route('/').get(verifyJWT, getResume);

router.route('/delete-resume').delete(verifyJWT, deleteResume)
export default router;