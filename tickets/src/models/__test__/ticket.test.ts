import { Ticket } from '../tickets';

it('implements optimistic concurrency control', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // save the ticket into the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two seprarate changes to the fetched tickets
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 20 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket
  // expect to see versioning error

  try {
    await secondInstance!.save();
  } catch (err) {
    expect(err.VersionError).not.toBeNull();
    return;
  }
});
