import { Publisher, OrderCancelledEvent, Subjects } from '@omekrit-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
