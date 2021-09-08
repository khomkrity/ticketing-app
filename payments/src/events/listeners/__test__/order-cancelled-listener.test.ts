import { OrderCancelledListener } from '../order-cancelled-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { OrderStatus, OrderCancelledEvent } from '@omekrit-ticketing/common';
import mongoose from 'mongoose';

const setupMockOrderEvent = async () => {
  // create an instance of the listener
  const listner = new OrderCancelledListener(natsWrapper.client);

  // create and save an order
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 20,
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, data, msg, order };
};

it('updates the status of the order', async () => {
  const { listner, data, msg, order } = await setupMockOrderEvent();

  // listen to the upcoming event
  await listner.onMessage(data, msg);

  // find updated order
  const updatedOrder = await Order.findById(order.id);

  // expect the order's status to be "Cancelled"
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acknowledges the message', async () => {
  const { listner, data, msg } = await setupMockOrderEvent();

  // listen to the upcoming event
  await listner.onMessage(data, msg);

  // expect to acknowledge the event
  expect(msg.ack).toHaveBeenCalled();
});
