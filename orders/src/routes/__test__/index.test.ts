import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/orders';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it('fetches orders for a particular user', async () => {
  // create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // create three users
  const userOne = global.signin();
  const userTwo = global.signin();
  const userThree = global.signin();

  // create one order for three different users
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', userThree)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // make request to get orders for one user
  const response = await request(app).get('/api/orders').set('Cookie', userTwo).expect(200);

  // expect to fetch only that user's order
  expect(response.body.length).toEqual(1);
  expect(response.body[0].id).toEqual(order.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
});
