import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a status code 404 if the provided id does not exist', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'updated ticket',
      price: 10,
    })
    .expect(404);
});

it('returns a status code 401 if the user is not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'updated ticket',
      price: 10,
    })
    .expect(401);
});

it('returns a status code 401 if the user does not own the ticket', async () => {
  // create new ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'new ticket',
      price: 10,
    })
    .expect(201);

  expect(response.body.title).toEqual('new ticket');
  expect(response.body.price).toEqual(10);

  // update ticket with a different user id
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'updated ticket',
      price: 99,
    })
    .expect(401);
});

it('returns a status code 400 if the user provides an invalid title or price', async () => {
  // create new ticket
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'new ticket',
      price: 10,
    })
    .expect(201);

  expect(response.body.title).toEqual('new ticket');
  expect(response.body.price).toEqual(10);

  // invalid title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  // invalid price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'update ticket',
      price: -1234,
    })
    .expect(400);
});

it('updates the ticket that has valid inputs and owner', async () => {
  // create new ticket
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'new ticket',
      price: 10,
    })
    .expect(201);

  expect(response.body.title).toEqual('new ticket');
  expect(response.body.price).toEqual(10);

  const updatedTitle = 'updated title';
  const updatedPrice = 99;

  const updatedTicket = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  expect(updatedTicket.body.title).toEqual(updatedTitle);
  expect(updatedTicket.body.price).toEqual(updatedPrice);
});
