import express from 'express';
import { CreateDraft, CreateStory, GetMyPosts, GetStories, GetStoryById } from '../controllers/storyController.js';

const storyRouter = express.Router();

const baseRoute = "/stories";

storyRouter.get(baseRoute, GetStories);
storyRouter.get(baseRoute+'/:pageNo', GetStories);

storyRouter.get(baseRoute+'/:userId/:pageNo', GetMyPosts);

storyRouter.post(baseRoute, CreateStory);
storyRouter.post(baseRoute+'/draft', CreateDraft);

const baseRouteStory = "/story";

storyRouter.get(baseRouteStory+'/:id', GetStoryById);


export default storyRouter; 