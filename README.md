# Bitespeed Identity Reconciliation Service

A production-ready backend service that implements **customer identity reconciliation** for the BiteSpeed backend assignment.

The system links multiple purchases made with different **emails or phone numbers** and returns a **consolidated identity view** of the customer.

---

# 🚀 Live Deployment

Frontend (Vercel)

(https://identity-reconciliation-chi.vercel.app/)

Backend API (Render)

https://identity-reconciliation-g31s.onrender.com/

Identify Endpoint

POST https://identity-reconciliation-g31s.onrender.com/identify

---

# 🧠 Problem Overview

Customers may place multiple orders using different **emails** or **phone numbers**.

Example

Order 1  
email = lorraine@hillvalley.edu  
phone = 123456  

Order 2  
email = mcfly@hillvalley.edu  
phone = 123456  

These orders belong to the **same person**.

The system identifies and merges these records into a **single identity cluster**.

Each cluster contains:

• one **primary contact**  
• multiple **secondary contacts**

The **oldest contact becomes the primary contact**.

---

# 🏗 System Architecture

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

---

# 📡 API Specification

Endpoint

POST /identify

Request Body

```json
{
  "email": "string | null",
  "phoneNumber": "string | null"
}
```

At least **one field must be present**.

Response Format

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "lorraine@hillvalley.edu",
      "mcfly@hillvalley.edu"
    ],
    "phoneNumbers": [
      "123456"
    ],
    "secondaryContactIds": [
      23
    ]
  }
}
```

Rules

• first email belongs to **primary contact**  
• first phone number belongs to **primary contact**

---

# 🔄 Identity Reconciliation Logic

The service performs the following steps

1. Search for Matching Contacts

Find contacts where

email = input.email  
OR  
phoneNumber = input.phoneNumber  

---

2. Handle New Customer

If no matches exist

Create a new **primary contact**

---

3. Resolve Identity Cluster

If matches exist

• collect all linked contacts  
• determine the **oldest primary contact**

---

4. Merge Primary Contacts

If multiple primary contacts are found

Oldest primary remains primary  
Other primary contacts become secondary

---

5. Create Secondary Contact

If the request contains **new information**

Create a secondary contact linked to the primary.

---

6. Return Consolidated Identity

Return

• primary contact id  
• all emails  
• all phone numbers  
• all secondary contact ids  

---

# 📂 Project Structure

Backend (`/backend`)

src  
├── controllers  
│   identifyController.ts  
│   dashboardController.ts  
│   contactController.ts  
│  
├── services  
│   identityService.ts  
│  
├── repositories  
│   contactRepository.ts  
│  
├── routes  
│   identifyRoutes.ts  
│  
├── db  
│   pool.ts  
│   migrate.ts  
│  
├── utils  
│   logger.ts  
│   validation.ts  
│  
└── index.ts  

tests  

jest.config.js  

package.json  

---

Frontend (`/frontend`)

src  
├── pages  
│   Dashboard.tsx  
│   Identify.tsx  
│   Contacts.tsx  
│   Activity.tsx  
│   Settings.tsx  
│  
├── api  
│   index.ts  
│  
├── components  
│   Sidebar.tsx  
│  
└── types  
    index.ts  

---

# 🛠 Tech Stack

Backend

Node.js  
TypeScript  
Express.js  
PostgreSQL (Neon)  

Frontend

React  
Vite  
Tailwind CSS  
Lucide Icons  

Libraries

Zod → request validation  
Pino → logging  
Jest → testing  
Supertest → API testing  

Hosting

Render → Backend  
Vercel → Frontend  

---

# ⚙️ Setup Instructions

Clone Repository

git clone https://github.com/sukumar-cloud/-Identity-Reconciliation.git

Install Dependencies

cd backend  
npm install  

cd ../frontend  
npm install  

Configure Environment

Create `.env` file inside backend

DATABASE_URL=your_postgresql_connection  
PORT=3000  

Run Database Migration

cd backend  
npm run migrate  

Run Development Servers

Terminal 1

cd backend  
npm run dev  

Terminal 2

cd frontend  
npm run dev  

---

# 📊 Example API Request

Create New Contact

POST /identify

```json
{
 "email": "lorraine@hillvalley.edu",
 "phoneNumber": "123456"
}
```

Response

```json
{
 "contact":{
  "primaryContactId":1,
  "emails":["lorraine@hillvalley.edu"],
  "phoneNumbers":["123456"],
  "secondaryContactIds":[]
 }
}
```

---

# 📊 Example Secondary Contact

POST /identify

```json
{
 "email": "mcfly@hillvalley.edu",
 "phoneNumber": "123456"
}
```

Response

```json
{
 "contact":{
  "primaryContactId":1,
  "emails":[
    "lorraine@hillvalley.edu",
    "mcfly@hillvalley.edu"
  ],
  "phoneNumbers":["123456"],
  "secondaryContactIds":[23]
 }
}
```

---

✔ GitHub repository published  
✔ `/identify` endpoint implemented  
✔ API hosted online  
✔ endpoint added in README  
✔ request/response format implemented  
✔ identity reconciliation logic implemented  

---

# 👨‍💻 Author

Sukumar R A  
Graduate Software Engineer Candidate
