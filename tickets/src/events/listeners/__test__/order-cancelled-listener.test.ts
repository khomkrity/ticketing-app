import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/tickets';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent } from '@omekrit-ticketing/common';
import mongoose from 'mongoose';

const setupMockOrderEvent = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId });
  await ticket.save();

  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
    version: 0,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('update the ticket by setting orderId of undefined to that ticket', async () => {
  const { listener, ticket, data, msg } = await setupMockOrderEvent();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeUndefined();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setupMockOrderEvent();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(ticketUpdatedData.orderId).toBeUndefined();
});

it('acknowledges the message', async () => {
  const { listener, data, msg } = await setupMockOrderEvent();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
