import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@omekrit-ticketing/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.put('/api/tickets/:id', async (req: Request, res: Response) => {});

export { router as updateTicketRouter };
