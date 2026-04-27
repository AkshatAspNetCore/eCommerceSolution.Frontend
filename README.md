# eCommerce Frontend — Angular SPA

Angular 17 single-page application for a distributed eCommerce platform. This is the
frontend layer of a .NET microservices system, communicating with backend services
through an Ocelot API Gateway.

## Architecture

This frontend is part of a larger microservices ecosystem:  
Browser (Angular SPA)
│
▼
API Gateway (Ocelot)
│
├── Users Microservice    (PostgreSQL / Dapper)
├── Products Microservice (MySQL / EF Core)
└── Orders Microservice   (MongoDB / Repository pattern)
│
▼
RabbitMQ (event-driven messaging)
│
▼
Redis (cache)

## Tech Stack

Angular 17 · TypeScript · RxJS · Reactive Forms · SCSS

## Getting Started

```bash
npm install
ng serve
```

App runs at `http://localhost:4200`.

The backend stack must be running for the app to function. Backend services
run via Docker Compose from separate repositories.

## Build

```bash
ng build --configuration=production
```

Output goes to `dist/`. Deployable to any static host.

---

Part of a portfolio project demonstrating .NET microservices with an Angular frontend.
