import express from 'express';
import { GetTopRatedStories } from '../controllers/topRatedController.js';

const topRatedRouter = express.Router();

const baseRoute = "/topRated";

topRatedRouter.get(baseRoute, GetTopRatedStories);
topRatedRouter.get(baseRoute+'/loggedUser/:userId', GetTopRatedStories);

export default topRatedRouter; 