# ticketing-app

Build a basic ticket selling app using microservice approach.\
This project is a part of the udemy course provided by Stephen Grider.

## Goal of this Project :dart:

1. Focus on how to apply microservice concept into building an applcation
2. Each part of features or use cases inside of the app can categorized and divided into services having its own independent system (i.e. programming language, business logic, database).
3. Get a basic understanding how asynchronous communication works inside the system using a message queue to publish and listen on events (data)

## System Overview :globe_with_meridians:

> This application provides a simple ticket selling (lots of improvement are needed if intended to use in the real world).

- **Auth**: Everything related to user accessing (registrating and authenticating) into the system.
- **Ticket**: tickets available to users to reserve and purchase
- **Order**: Acts like shopping cart for each user to reserve a ticket.
- **Expiration**: Watches for orders to be created, cancels them after 15 minutes.
- **Payment**: Handles credit card payments. Cancels orders if payments fails, completes if payment succeeds.

_Side Note_: _Each service is contained inside a docker image which will be deployed inside a kubernetes pod (one container per pod) which is exposed by a Cluster IP service._

_Another Side Note_: _Since all of the services are independent, having its own system and database, that's where message queue comes into play to asynchronously publish and listen on events (data) throughout all services._

## Tech Stack :toolbox:

- **Programming Language**: Javascript, Typescript
- **Front-end Framework**: Next.js (server-side rendering version of React)
- **Back-end Framework**: Express.js, Node.js
- **Database**: MongoDB, Redis
- **Package Manager**: npm
- **Devops**: Docker, Kubernetes, NATS Streaming Server, ingress-nginx, Skaffold, Github Actions

## Lesson Learned :books:

> [@omekrit](https://www.github.com/omekrit)'s opinion

- The big challenge in microservice is **data** since each service has its own database.
- Typescript makes it a lot easier to capture data properties and bugs inside the system.
- Testing is a must for this type of application and you need to make sure that the components inside each service are loosely coupled so that you can create mocks and test on a single unit/component.
- Async communication focuses on communicating changes using events sent to an event bus.
- Async communication encourages each service to be 100% self-sufficient which will be relatively easy to handle temporary downtime or new service creation.
- Data replication is needed for microservice.
- Docker makes it easier to package up services.
- Kubernetes is a pain to setup, but makes it easier to deploy and scale services.
- You can use cloud service provider to leverage the image building and container orchestration process if your local machine has low speed cpu and not a lot of RAM
- Apart of microservice concept, it's a prerequisite for everyone before jumping into the microservice world to first have a basic understanding of **how to build an app (programming languages, front-end, back-end, frameworks, tools, and other stuff related)**

### Further Improvements :chart_with_upwards_trend:

- Redesign in business logic and database structures inside the system is needed if intended to use as a real world application.
- To deploy the system, further kubernetes cluster configuration: service, load balancer, host, and github workflow is required.
- User interface/experience part is currently overlooked (since this app focuses only on the back-end)
