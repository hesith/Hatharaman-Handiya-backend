import express from 'express';
import { ProcessComment, GetCommentsByStoryId } from '../controllers/commentsController.js';

const commentsRouter = express.Router();

const baseRoute = "/comments";

commentsRouter.post(baseRoute, ProcessComment);
commentsRouter.get(baseRoute + '/:id', GetCommentsByStoryId);

export default commentsRouter; 