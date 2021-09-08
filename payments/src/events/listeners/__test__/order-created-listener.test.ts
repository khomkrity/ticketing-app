import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@omekrit-ticketing/common';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';

const setupMockOrderEvent = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'random',
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 20,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setupMockOrderEvent();

  // listen to the upcoming event
  await listener.onMessage(data, msg);

  const createdOrder = await Order.findById(data.id);

  // expect to successfully replicate the order price
  expect(createdOrder!.price).toEqual(data.ticket.price);
});

it('acknowledges the message', async () => {
  const { listener, data, msg } = await setupMockOrderEvent();

  // listen to the upcoming event
  await listener.onMessage(data, msg);

  // expect to acknowledge the event
  expect(msg.ack).toHaveBeenCalled();
});
