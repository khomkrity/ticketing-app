import { Publisher, Subjects, TicketUpdatedEvent } from '@omekrit-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
