import express from 'express';
import { GetContributorDetails } from '../controllers/contributorController.js';

const contributorRouter = express.Router();

const baseRoute = "/contributor";

contributorRouter.get(baseRoute+'/:id', GetContributorDetails);

export default contributorRouter; 