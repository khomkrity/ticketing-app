import request from 'supertest';
import { app } from '../../app';
import { endPoints } from './end-points';

const { signin, signup } = endPoints;

it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post(signin)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post(signup)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post(signin)
    .send({
      email: 'test@test.com',
      password: 'not a correct password',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post(signup)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post(signin)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
