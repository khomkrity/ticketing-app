import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@omekrit-ticketing/common';
import { Order } from '../models/order';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('token must be provided'),
    body('orderId').not().isEmpty().withMessage('order id must be provided'),
  ],
  (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as createChargeRouter };
