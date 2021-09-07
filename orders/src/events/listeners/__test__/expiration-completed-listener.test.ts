import { ExpirationCompletedListener } from '../expiration-completed-listener';
import { ExpirationCompletedEvent } from '@omekrit-ticketing/common';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../../models/orders';
import { Ticket } from '../../../models/ticket';

const setupMockOrderExpirationEvent = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create and save an order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'random',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setupMockOrderExpirationEvent();

  // listen to the upcoming event
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  // expect the order's status to change
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setupMockOrderExpirationEvent();

  // listen to the upcoming event
  await listener.onMessage(data, msg);

  // expect to publish an event inside the listener
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  // expect the published order to be identical
  expect(eventData.id).toEqual(order.id);
});

it('acknowledges the message', async () => {
  const { listener, data, msg } = await setupMockOrderExpirationEvent();

  // listen to the upcoming event
  await listener.onMessage(data, msg);

  // expect to acknowledge the event
  expect(msg.ack).toHaveBeenCalled();
});
