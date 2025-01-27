import express from 'express';
import { CreateStory, GetStories } from '../controllers/storyController.js';

const storyRouter = express.Router();

const baseRoute = "/stories";

storyRouter.get(baseRoute, GetStories);
storyRouter.get(baseRoute+'/:pageNo', GetStories);
storyRouter.post(baseRoute, CreateStory);


export default storyRouter; 