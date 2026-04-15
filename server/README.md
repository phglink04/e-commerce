# PlantWorld Server (NestJS + TypeScript)

This folder contains the migrated backend from ExpressJS to NestJS with modular architecture.

## Modules

- `AuthModule`
- `UsersModule`
- `PlantsModule`
- `OrdersModule`
- `FaqsModule`
- `PaymentsModule`
- `MailModule` (provider for email sending)

## Tech Stack

- NestJS 10
- TypeScript
- Mongoose via `@nestjs/mongoose`
- Passport JWT auth
- `class-validator` DTO validation
- Razorpay provider integration
- Nodemailer provider integration

## Setup

1. Copy `.env.example` to `.env` and configure values.
2. Install dependencies:

```bash
npm install
```

3. Run in development:

```bash
npm run start:dev
```

4. Build:

```bash
npm run build
```

## API Prefix

All routes are under `/api`.

Examples:

- `POST /api/users/signup`
- `POST /api/users/login`
- `GET /api/plants`
- `POST /api/orders`
- `POST /api/payment/checkout`

## Notes

- Role-based authorization now uses Passport JWT + `JwtAuthGuard` + `RolesGuard` with `@Roles(...)`.
- Legacy `restrictTo` middleware has been replaced by Nest guards.
- Main model migrations are implemented as schemas with decorators:
  - `UserSchema`
  - `PlantSchema`
  - `OrderSchema`
