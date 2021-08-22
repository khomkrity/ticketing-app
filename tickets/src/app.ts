import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@omekrit-ticketing/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(indexTicketRouter);
app.use(createTicketRouter);
app.use(showTicketRouter);

app.all('*', () => {
  throw new NotFoundError();
});

// error handler middleware
app.use(errorHandler);

export { app };
