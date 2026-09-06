import express from 'express';
import { GetTopRatedStories, GetTopRatedPage } from '../controllers/topRatedController.js';

const topRatedRouter = express.Router();

const baseRoute = "/topRated";

topRatedRouter.get(baseRoute, GetTopRatedStories);
topRatedRouter.get(baseRoute+'/loggedUser/:userId', GetTopRatedStories);
topRatedRouter.get(baseRoute+'/page/:pageNo', GetTopRatedPage);
topRatedRouter.get(baseRoute+'/page/:pageNo/loggedUser/:userId', GetTopRatedPage);

export default topRatedRouter;