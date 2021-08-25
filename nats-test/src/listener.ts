import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

// clear out terminal
console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:3763',
});

stan.on('connect', () => {
  console.log('listener connected to nats');

  stan.on('close', () => {
    console.log('nats connections closed');
    process.exit();
  });

  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group', options);

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
