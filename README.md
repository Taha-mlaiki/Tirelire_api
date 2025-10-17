# Tirelire — API

Minimal documentation for the Tirelire project (Express + MongoDB).  
Open main app: [src/app.js](src/app.js)

---

## Overview

Tirelire is a backend API that provides user authentication, group management (rotating rounds), chat, ticketing and KYC verification. Core modules:

- Authentication: [`AuthService`](src/services/AuthService.js), routes [src/routes/auth.routes.js](src/routes/auth.routes.js)
- Groups: [`GroupService`](src/services/GroupService.js), controller [`GroupController`](src/controllers/GroupController.js), routes [src/routes/group.routes.js](src/routes/group.routes.js)
- Tickets: [`TicketService`](src/services/TicketService.js), routes [src/routes/ticket.routes.js](src/routes/ticket.routes.js)
- Chat: [`ChatService`](src/services/ChatService.js), controller [`ChatController`](src/controllers/ChatController.js)
- KYC: face-api based controller [src/controllers/KycController.js](src/controllers/KycController.js)

Models: [src/models/User.js](src/models/User.js), [src/models/Group.js](src/models/Group.js), [src/models/Ticket.js](src/models/Ticket.js), [src/models/Notification.js](src/models/Notification.js)

Repositories live in: [src/repositories](src/repositories)

Database connector: [src/config/database.js](src/config/database.js)

Middleware examples: [src/middlewares/AuthMiddleware.js](src/middlewares/AuthMiddleware.js), [src/middlewares/ProfileMiddleware.js](src/middlewares/ProfileMiddleware.js)

---

## Requirements

- Node 18+ (or latest LTS)
- MongoDB (connection string in env)
- Optional: Stripe API keys if payment features used
- Face-api models stored at `src/face-models` (used by KYC)

---

## Quick start

1. Clone repository and open the project folder.

2. Install dependencies
   - Windows (from project root)
     ```
     npm install
     ```

3. Create a `.env` in project root with at least the variables below.

.env.example:

```
MONGO_URI=mongodb://localhost:27017/tirelire
JWT_SECRET=your_jwt_secret
PORT=3000

# Optional for payments
STRIPE_SECRET_KEY=sk_test_...
```

4. Start the app
   - development (if you use nodemon)
     ```
     npm run dev
     ```
   - production
     ```
     npm start
     ```

Open API root via configured port (see [src/app.js](src/app.js)).

---

## Common scripts & tests

- Run tests (project uses Jest + Supertest in tests)
  ```
  npm test
  ```

See example test: [src/**test**/auth.test.js](src/__test__/auth.test.js)

---

## Important endpoints

(Authenticated routes use `AuthMiddleware.verifyToken`)

- Auth
  - POST /api/auth/register — register new user
  - POST /api/auth/login — login

- Groups ([src/routes/group.routes.js](src/routes/group.routes.js))
  - POST /api/groups/ — create group (requires profile verification middleware)
  - GET /api/groups/ — list groups
  - POST /api/groups/:id/join — join group
  - POST /api/groups/:id/leave — leave group
  - PUT /api/groups/:id — update group
  - DELETE /api/groups/:id — delete group

- Tickets ([src/routes/ticket.routes.js](src/routes/ticket.routes.js))
  - POST /api/tickets/ — create ticket
  - GET /api/tickets/:groupId — list tickets for group
  - PUT /api/tickets/:ticketId — update ticket status

- KYC ([src/routes/kyc.routes.js](src/routes/kyc.routes.js))
  - POST /api/kyc/verify — multipart upload for face + id images (uses multer)

- Chat
  - POST /api/chat/ — send message (supports optional audio file)
  - GET /api/chat/:groupId — get group messages

---

## Data models (high level)

- User ([src/models/User.js](src/models/User.js))
  - firstName, lastName, email, password, role, kyc (status, idNumber, idImageUrl, faceVerified), reliabilityScore

- Group ([src/models/Group.js](src/models/Group.js))
  - name, description, paymentAmount, paymentDate, currentRound, totalRounds, order, members, balances

- Ticket ([src/models/Ticket.js](src/models/Ticket.js))
  - title, description, groupId, createdBy, status

---

## File uploads

- Multer storage: [src/utils/upload.js](src/utils/upload.js)  
  Uploaded files are stored under `uploads/` with timestamped filenames. KYC expects face and id images (see [src/routes/kyc.routes.js](src/routes/kyc.routes.js)).

---

## KYC / face recognition

- KYC uses face-api.js + canvas in [src/controllers/KycController.js](src/controllers/KycController.js). Place pre-trained models under `src/face-models`. The controller loads models at startup.

---

## Payments

- Payment-related logic is in `src/services/PaymentService.js` and uses Stripe via a local config (see `src/config/stripe.js` if present). If payments are used, set STRIPE_SECRET_KEY in .env.

---

## Error handling & validations

- Centralized error middleware in [src/middlewares/ErrorMiddleware.js](src/middlewares/ErrorMiddleware.js) is mounted in [src/app.js](src/app.js).
- Request validation example: [src/validations/AuthValidation.js](src/validations/AuthValidation.js) (uses zod).

---

## Development notes

- Repositories encapsulate DB access (see [src/repositories/GroupRepository.js](src/repositories/GroupRepository.js), [src/repositories/TicketRepository.js](src/repositories/TicketRepository.js)).
- Services contain business logic and call repositories (e.g. [`GroupService`](src/services/GroupService.js), [`TicketService`](src/services/TicketService.js)).
- Controllers handle request/response and call services (see [src/controllers](src/controllers)).

---

## Contributing

- Follow existing code patterns (controllers → services → repositories → models).
- Add tests for new endpoints (see [src/**test**](src/__test__)).

---

## License

Add license details here (e.g. MIT).

---

If you want, I can:

- generate a .env.example file,
- add a basic CONTRIBUTING.md,
- scaffold GitHub workflows for CI/tests,
- or create API documentation (OpenAPI/Swagger) for the routes listed above.
