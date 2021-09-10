import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@omekrit-ticketing/common';
import mongoose from 'mongoose';

it('returns a 404 status code when puchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'random',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 status code when purchasing an order that does not belong to the user', async () => {
  // create an order with a random user id
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    version: 0,
    status: OrderStatus.Created,
  });
  await order.save();

  // try to pay an order with another random user id
  // expect to throw not authorized error
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'random',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 status code when purchasing a cancelled order', async () => {
  // create an order with a random user id that has a 'cancelled' status
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    version: 0,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  // try to pay for a cancelled order
  // expect to throw bad request error
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'random',
    })
    .expect(400);
});
