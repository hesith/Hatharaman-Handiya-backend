import express from 'express';
import { GetLibraryStories } from '../controllers/libraryController.js';

const libraryRouter = express.Router();

const baseRoute = "/library";

libraryRouter.get(baseRoute+'/:userId', GetLibraryStories);

export default libraryRouter;
