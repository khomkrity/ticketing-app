import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

// mock nats client
jest.mock('../nats-wrapper');

// stripe secret key
process.env.STRIPE_KEY =
  'sk_test_51JY4L0HLzMBLHCF19UVSRFyUUn4BVgg1iHb5srh7oQUXvcKVqmODEIL7w1Eo0qdNRNH8W3zgiK5iIl6RgTISJKg500Xq3Z1AlD';

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = 'asf';

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // build a jwt payload.
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@email.com',
  };

  // create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build express session object
  const session = { jwt: token };

  // convert session into json
  const sessionJSON = JSON.stringify(session);

  // encode json to base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string in a form of cookie
  return [`express:sess=${base64}`];
};
