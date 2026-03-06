# Bitespeed Identity Reconciliation Service

A production-ready backend service that implements **customer identity reconciliation** for the BiteSpeed backend assignment.

The system links multiple purchases made with different **emails or phone numbers** and returns a **consolidated identity view** of the customer.

---

# 🚀 Live Deployment

**Frontend (Vercel)**
[https://identity-reconciliation-r6hw3fnvj-sssssssssssssss-projects.vercel.app/](https://identity-reconciliation-r6hw3fnvj-sssssssssssssss-projects.vercel.app/)

**Backend API (Render)**
[https://identity-reconciliation-g31s.onrender.com/](https://identity-reconciliation-g31s.onrender.com/)

**Identify Endpoint**
`POST https://identity-reconciliation-g31s.onrender.com/identify`

---

# 🧠 Problem Overview

Customers may place multiple orders using different **emails** or **phone numbers**.

**Example**
Order 1: email = lorraine@hillvalley.edu, phone = 123456
Order 2: email = mcfly@hillvalley.edu, phone = 123456

These orders belong to the **same person**. The system identifies and merges these records into a **single identity cluster**.

Each cluster contains:
• one **primary contact**
• multiple **secondary contacts**

The **oldest contact becomes the primary contact**.

---

# 🏗 System Architecture

```
Client (Frontend - Vercel)
        │
        ▼
POST /identify
        │
        ▼
Express Controller
        │
        ▼
Identity Service (Business Logic)
        │
        ▼
Contact Repository
        │
        ▼
PostgreSQL Database (Neon)
```

---

# 📡 API Specification

**Endpoint**: `POST /identify`

**Request Body**:
```json
{
  "email": "string | null",
  "phoneNumber": "string | null"
}
```

**Response Format**:
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

---

# 📂 Project Structure

### 📁 Backend (`/backend`)
```
src/
├── controllers/
│   ├── identifyController.ts    # Main reconciliation logic
│   ├── dashboardController.ts   # Stats for dashboard
│   └── contactController.ts     # Contact registry & search
├── services/
│   └── identityService.ts       # Core business logic
├── repositories/
│   └── contactRepository.ts     # Database abstraction
├── routes/
│   └── identifyRoutes.ts        # API route definitions
├── db/
│   ├── pool.ts                 # Connection pooling
│   └── migrate.ts              # Schema migrations
├── utils/
│   ├── logger.ts               # Structured logging
│   └── validation.ts           # Input validation
└── index.ts                    # Entry point & Middleware
```

### 📁 Frontend (`/frontend`)
```
src/
├── pages/
│   ├── Dashboard.tsx            # Real-time metrics
│   ├── Identify.tsx             # Interactive API tester
│   ├── Contacts.tsx             # Identity registry table
│   ├── Activity.tsx             # Audit trail feed
│   └── Settings.tsx             # System configuration
├── api/
│   └── index.ts                # Axios client & polling
├── components/
│   └── Sidebar.tsx             # Navigation
└── types/
    └── index.ts                # Shared TS interfaces
```

---

# 🛠 Tech Stack

- **Backend**: Node.js, TypeScript, Express, PostgreSQL (Neon)
- **Frontend**: React, Tailwind CSS, Lucide Icons, Vite
- **Libraries**: Zod (Validation), Pino (Logging), Jest & Supertest (Testing)
- **Hosting**: Render (Backend), Vercel (Frontend)

---

# ⚙️ Setup Instructions

1. **Clone & Install**
```bash
git clone https://github.com/sukumar-cloud/-Identity-Reconciliation.git
cd backend && npm install
cd ../frontend && npm install
```

2. **Database Migration**
```bash
cd backend
# Set DATABASE_URL in .env
npm run migrate
```

3. **Run Development**
```bash
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

---

# 👨‍💻 Author
**Sukumar R A**
*Graduate Software Engineer Candidate*
