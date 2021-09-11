import { Publisher, Subjects, PaymentCreatedEvent } from '@omekrit-ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
