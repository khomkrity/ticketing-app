import { Subjects, Publisher, ExpirationCompletedEvent } from '@omekrit-ticketing/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}
