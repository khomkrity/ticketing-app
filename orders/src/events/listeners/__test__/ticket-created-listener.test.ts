import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@omekrit-ticketing/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setupMockTicketEvent = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setupMockTicketEvent();

  // call the onMessage function with data and message object
  await listener.onMessage(data, msg);

  // expect a ticket to be created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acknowledges the message', async () => {
  const { listener, data, msg } = await setupMockTicketEvent();

  // call the onMessage function with data and message object
  await listener.onMessage(data, msg);

  // expect the listener to acknowledge the message
  expect(msg.ack).toHaveBeenCalled();
});
