import express from 'express';
import { GetRandomStories } from '../controllers/randomController.js';

const randomRouter = express.Router();

const baseRoute = "/random";

randomRouter.get(baseRoute+'/:count', GetRandomStories);
randomRouter.get(baseRoute+'/:count/loggedUser/:userId', GetRandomStories);

export default randomRouter;
