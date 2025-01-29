import express from 'express';
import { ProcessLike } from '../controllers/likesController.js';

const likesRouter = express.Router();

const baseRoute = "/likes";

likesRouter.post(baseRoute, ProcessLike);

export default likesRouter; 