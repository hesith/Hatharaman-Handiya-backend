import express from 'express';
import { VerifyGoogleAuthIdToken } from '../controllers/authController.js';

const authRouter = express.Router();

const baseRoute = "/auth";

authRouter.post(baseRoute+'/verify', VerifyGoogleAuthIdToken);


export default authRouter; 