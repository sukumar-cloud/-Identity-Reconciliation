# Bitespeed Identity Reconciliation Service

A Node.js/TypeScript backend service for customer identity reconciliation as part of the Bitespeed backend task.

## 🎯 Task Overview

This service implements the Identity Reconciliation endpoint `/identify` that consolidates customer contact information across multiple purchases with different email addresses or phone numbers.

## 🚀 Live Endpoint

**Production URL**: [Your deployed endpoint will be here after deployment]

## 📋 API Endpoint

### POST /identify

**Request Body:**
```json
{
  "email": "string | null",
  "phoneNumber": "string | null"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
```

## 🏗️ Project Structure

- **Backend**: Node.js with TypeScript, Express, PostgreSQL
- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Deployment**: Render for backend

## 🛠️ Setup Instructions

### Backend
```bash
cd backend
npm install
npm run build
npm run migrate
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Features

- ✅ Identity reconciliation based on email/phone matching
- ✅ Primary/secondary contact linking
- ✅ Automatic merging of contact clusters
- ✅ Proper handling of new vs existing contacts
- ✅ Database transaction integrity
- ✅ Comprehensive error handling

## 🎯 Tech Stack

**Backend:**
- Node.js
- TypeScript
- Express
- PostgreSQL
- Render (deployment)

**Frontend:**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## 🧪 Testing Examples

The service handles all the required scenarios:

1. **New customer**: Creates primary contact
2. **Existing contact**: Returns consolidated information
3. **Secondary contact creation**: Links new info to existing primary
4. **Primary merging**: Converts newer primary to secondary when clusters merge

## 📝 Deployment

This project is configured for deployment on Render.com with automatic database provisioning and migration.
