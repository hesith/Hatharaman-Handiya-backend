import express from 'express';
import { createStory, getStories } from '../controllers/storyController.js';

const storyRouter = express.Router();

const baseRoute = "/stories";

storyRouter.get(baseRoute, getStories);
storyRouter.post(baseRoute, createStory);


export default storyRouter; 