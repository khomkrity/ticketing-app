# ticketing-app

applying microservice concepts into building a ticket selling web app

### Prerequisite

- **Package Manager**: npm
- **Devops**: docker, kubernetes, skaffold

### Services

- **Auth**: Everything related to user accessing (registrating and authenticating) into the system.
- **Ticket**: Ticket creation/editing.
- **Order**: Order creation/editing.
- **Expiration**: Watches for orders to be created, cancels them after 15 minutes.
- **Payment**: Handles credit card payments. Cancels orders if payments fails, completes if payment succeeds.

### Getting Started

```bash
# start running all of the deployemnts and services
skaffold dev
```
