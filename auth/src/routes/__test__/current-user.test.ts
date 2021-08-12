import request from 'supertest';
import { app } from '../../app';
import { endPoints } from './end-points';

const { currentuser } = endPoints;

it('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(currentuser).get(currentuser).set('Cookie', cookie).expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});
