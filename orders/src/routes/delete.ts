import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/orders';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@omekrit-ticketing/common';

const router = express.Router();

// could be patch or put
router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  res.send(order);
});

export { router as deleteOrderRouter };
