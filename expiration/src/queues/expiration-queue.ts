import Queue from 'bull';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async job => {
  console.log('to do: publish an expiration:complete event for order id', job.data.orderId);
});

export { expirationQueue };
