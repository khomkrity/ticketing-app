import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@omekrit-ticketing/common';
import { TicketUpdatedListener } from '../ticket-updated.listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setupMockTicketEvent = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'party',
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, ticket, msg } = await setupMockTicketEvent();

  // call the onMessage function with data and message object
  await listener.onMessage(data, msg);

  // fetch the updated version of the ticket
  const updatedTicket = await Ticket.findById(ticket.id);

  // expect to see changes to the ticket
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acknowledges the message', async () => {
  const { listener, data, msg } = await setupMockTicketEvent();

  // call the onMessage function with data and message object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not acknowledge the event with a wrong version of order', async () => {
  const { listener, data, msg } = await setupMockTicketEvent();

  // skip the version
  data.version = 999;

  // expect the listener to not acknowledge the event
  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    return;
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
