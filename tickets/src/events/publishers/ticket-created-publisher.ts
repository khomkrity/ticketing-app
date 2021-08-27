import { Publisher, Subjects, TicketCreatedEvent } from '@omekrit-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
