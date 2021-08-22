import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: string, price: number) => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price });
};

it('returns all the tickets with out authentication', async () => {
  // create tickets
  await createTicket('sample ticket', 10);
  await createTicket('another ticket', 20);
  await createTicket('super cool ticket', 30);

  // fecth all created tickets
  const response = await request(app).get('/api/tickets').send({}).expect(200);

  expect(response.body.length).toEqual(3);
});
