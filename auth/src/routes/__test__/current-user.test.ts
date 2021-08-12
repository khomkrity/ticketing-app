import request from 'supertest';
import { app } from '../../app';
import { endPoints } from './end-points';

const { signup, currentuser } = endPoints;

it('responds with details about the current user', async () => {
  const signupResponse = await request(app)
    .post(signup)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const cookie = signupResponse.get('Set-Cookie');

  const response = await request(currentuser).get(currentuser).set('Cookie', cookie).expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});
