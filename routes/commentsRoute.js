import express from 'express';
import { ProcessComment, GetCommentsByStoryId, DeleteCommentById } from '../controllers/commentsController.js';

const commentsRouter = express.Router();

const baseRoute = "/comments";

commentsRouter.post(baseRoute, ProcessComment);
commentsRouter.delete(baseRoute + '/:id', DeleteCommentById);
commentsRouter.get(baseRoute + '/:id', GetCommentsByStoryId);

export default commentsRouter; 