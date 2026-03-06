# Identity Reconciliation Service

A production-ready identity reconciliation system that links customer contact information across multiple touchpoints.

##  Core API

### POST /identify
Consolidates contact information (email/phoneNumber) into a single customer profile.

**Request:**
`json
{
  " email\: \mcfly@hillvalley.edu\,
 \phoneNumber\: \123456\
}
`

**Response:**
`json
{
 \contact\: {
 \primaryContatctId\: 1,
 \emails\: [\lorraine@hillvalley.edu\, \mcfly@hillvalley.edu\],
 \phoneNumbers\: [\123456\],
 \secondaryContactIds\: [23]
 }
}
`

## Tech Stack
- **Backend**: Node.js, TypeScript, Express, PostgreSQL
- **Frontend**: React, Tailwind CSS, Lucide Icons, Vite
- **Validation**: Zod
- **Logging**: Pino
- **Testing**: Jest, Supertest

## Architecture
- **Controllers**: Handle HTTP requests and validation.
- **Services**: Orchestrate business logic for identity reconciliation.
- **Repositories**: Direct database interaction (PostgreSQL).
- **Frontend**: Real-time monitoring dashboard with automatic polling.

## Setup & Run

### 1. Database
Create a PostgreSQL database and set DATABASE_URL in ackend/.env.

### 2. Backend
`ash
cd backend
npm install
npm run migrate
npm run dev
`

### 3. Frontend
`ash
cd frontend
npm install
npm run dev
`

## Testing
`ash
cd backend
npm test
`

---
*Created for the Bitespeed Backend Task.*
