import express from 'express';
import { ProcessRating } from '../controllers/ratingsController.js';

const ratingsRouter = express.Router();

const baseRoute = "/ratings";

ratingsRouter.post(baseRoute, ProcessRating);

export default ratingsRouter; 