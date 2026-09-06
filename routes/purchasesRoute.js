import express from 'express';
import { RecordPurchase, GetPurchaseStatus } from '../controllers/purchasesController.js';

const purchasesRouter = express.Router();

const baseRoute = "/purchases";

purchasesRouter.post(baseRoute, RecordPurchase);
purchasesRouter.get(baseRoute + '/:userId', GetPurchaseStatus);

export default purchasesRouter;
