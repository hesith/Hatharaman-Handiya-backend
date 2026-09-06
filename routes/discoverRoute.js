import express from 'express';
import { DiscoverStories } from '../controllers/discoverController.js';

const discoverRouter = express.Router();

const baseRoute = "/discover";

discoverRouter.get(baseRoute+'/:pageNo', DiscoverStories);
discoverRouter.get(baseRoute+'/:pageNo/loggedUser/:userId', DiscoverStories);

export default discoverRouter;
