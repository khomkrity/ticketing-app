import nats from 'node-nats-streaming';

// clear out terminal
console.clear();

// client
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:3763',
});

stan.on('connect', () => {
  console.log('publisher connected to nats');

  const data = JSON.stringify({
    id: '123',
    title: 'movie',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('event published');
  });
});
