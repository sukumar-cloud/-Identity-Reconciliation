# Bitespeed Identity Reconciliation Service

A production-grade Node.js/TypeScript backend service for customer identity reconciliation as part of the Bitespeed backend task.

## �️ System Architecture

```
Client
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
PostgreSQL Database
```

## �🎯 Task Overview

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

```
backend/
├── src/
│   ├── controllers/
│   │     identifyController.ts     # HTTP request handling
│   ├── services/
│   │     identityService.ts        # Business logic
│   ├── repositories/
│   │     contactRepository.ts      # Database operations
│   ├── routes/
│   │     identifyRoutes.ts         # Route definitions
│   ├── utils/
│   │     logger.ts               # Logging configuration
│   │     responseBuilder.ts      # Response formatting
│   │     validation.ts           # Input validation
│   ├── models/
│   │     contact.ts              # Type definitions
│   ├── db/
│   │     pool.ts                # Database connection
│   │     migrate.ts             # Database migration
│   ├── __tests__/
│   │     identify.test.ts        # Integration tests
│   └── index.ts                 # Application entry point
├── tests/                        # Additional test files
├── jest.config.js               # Jest configuration
├── render.yaml                  # Render deployment config
└── package.json
```

## 🛠️ Tech Stack

**Backend:**
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Zod (validation)
- Pino (logging)
- Jest (testing)
- Supertest (API testing)

**Infrastructure:**
- Render (deployment)
- GitHub (version control)

## � Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Local Development
```bash
cd backend
npm install
npm run build
npm run migrate
npm start
```

### Development Mode
```bash
npm run dev
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

## 📊 Features

- ✅ **Identity reconciliation** based on email/phone matching
- ✅ **Primary/secondary contact linking** with proper precedence
- ✅ **Automatic merging** of contact clusters
- ✅ **Input validation** with Zod schemas
- ✅ **Structured logging** with Pino
- ✅ **Comprehensive testing** with Jest and Supertest
- ✅ **Database transactions** for data integrity
- ✅ **Error handling** and proper HTTP status codes
- ✅ **Clean architecture** with separation of concerns

## 🧪 Test Coverage

The test suite covers all critical scenarios:

1. **New Contact Creation**
   - Email and phone provided
   - Email only
   - Phone only

2. **Existing Contact Identification**
   - Email matching
   - Phone matching

3. **Secondary Contact Creation**
   - Same phone, different email
   - Same email, different phone

4. **Primary Merging**
   - Two primary clusters merging
   - Correct precedence handling

5. **Input Validation**
   - Missing required fields
   - Invalid email formats
   - Edge cases

## 📝 Algorithm Explanation

### Core Logic
1. **Find Matches**: Search for contacts by email or phone
2. **Handle New Customer**: Create primary contact if no matches
3. **Resolve Clusters**: Identify all connected contact clusters
4. **Merge if Needed**: Combine multiple clusters with oldest primary winning
5. **Create Secondary**: Add new info as secondary contact if needed
6. **Build Response**: Format according to specification

### Edge Cases Handled
- Multiple primary contact merging
- Duplicate request prevention
- Null value handling
- Transaction integrity
- Concurrent request safety

## 📦 Deployment

### Render Deployment
1. Connect GitHub repository to Render
2. Use provided `render.yaml` configuration
3. Automatic build and deployment
4. Database provisioning included

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (production/development)
- `LOG_LEVEL`: Logging level (info/debug/error)

## 🔧 Configuration

### Database Schema
```sql
CREATE TABLE Contact (
  id              SERIAL PRIMARY KEY,
  phoneNumber     VARCHAR(20),
  email           VARCHAR(255),
  linkedId        INTEGER REFERENCES Contact(id),
  linkPrecedence  VARCHAR(10) CHECK (linkPrecedence IN ('primary', 'secondary')),
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deletedAt       TIMESTAMPTZ
);
```

### Indexes for Performance
- `idx_contact_email` on email
- `idx_contact_phone` on phoneNumber  
- `idx_contact_linked_id` on linkedId

## 📈 Performance Considerations

- **Database Indexes**: Optimized for email and phone lookups
- **Connection Pooling**: Efficient database connection management
- **Transaction Safety**: ACID compliance for data integrity
- **Query Optimization**: Minimal database calls per request

## 🎯 Production Readiness

This implementation demonstrates:

- **Clean Architecture**: Separation of concerns across layers
- **Type Safety**: Full TypeScript implementation
- **Input Validation**: Robust request validation
- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging for debugging
- **Testing**: High test coverage with edge cases
- **Documentation**: Clear API and code documentation
- **Deployment**: Production-ready deployment config

## 📊 API Examples

### New Customer
```bash
POST /identify
{
  "email": "lorraine@hillvalley.edu",
  "phoneNumber": "123456"
}

Response:
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

### Secondary Contact Creation
```bash
POST /identify
{
  "email": "mcfly@hillvalley.edu", 
  "phoneNumber": "123456"
}

Response:
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

## 🏆 Submission Checklist

- ✅ Clean project structure with proper architecture
- ✅ Working `/identify` endpoint with correct format
- ✅ Comprehensive test suite
- ✅ Professional README with system design
- ✅ Production-ready deployment configuration
- ✅ Proper commit history with meaningful messages
- ✅ Hosted service endpoint (after deployment)

## 📝 Submission

1. **Deploy to Render** using the provided configuration
2. **Update README** with your live endpoint URL
3. **Submit the task** using the Google Form: https://forms.gle/hsQBJQ8tzbsp53D77

---

**Built with ❤️ following production-grade best practices**
