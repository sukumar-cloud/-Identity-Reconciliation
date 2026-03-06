import request from 'supertest';
import app from '../index';
import pool from '../db/pool';

async function resetDb() {
  await pool.query('TRUNCATE TABLE "Contact" RESTART IDENTITY CASCADE');
}

describe('POST /identify', () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    try {
      await resetDb();
    } finally {
      await pool.end();
    }
  });

  describe('New Contact Creation', () => {
    it('should create a new primary contact when no existing contacts found', async () => {
      const response = await request(app)
        .post('/identify')
        .send({
          email: 'test@example.com',
          phoneNumber: '1234567890'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('contact');
      expect(response.body.contact.primaryContatctId).toBeDefined();
      expect(response.body.contact.emails).toEqual(['test@example.com']);
      expect(response.body.contact.phoneNumbers).toEqual(['1234567890']);
      expect(response.body.contact.secondaryContactIds).toEqual([]);
    });

    it('should create new contact with email only', async () => {
      const response = await request(app)
        .post('/identify')
        .send({
          email: 'emailonly@example.com',
          phoneNumber: null
        });

      expect(response.status).toBe(200);
      expect(response.body.contact.emails).toEqual(['emailonly@example.com']);
      expect(response.body.contact.phoneNumbers).toEqual([]);
    });

    it('should create new contact with phone only', async () => {
      const response = await request(app)
        .post('/identify')
        .send({
          email: null,
          phoneNumber: '9876543210'
        });

      expect(response.status).toBe(200);
      expect(response.body.contact.emails).toEqual([]);
      expect(response.body.contact.phoneNumbers).toEqual(['9876543210']);
    });
  });

  describe('Existing Contact Identification', () => {
    it('should return existing contact when email matches', async () => {
      // First create a contact
      await request(app)
        .post('/identify')
        .send({
          email: 'existing@example.com',
          phoneNumber: '1111111111'
        });

      // Then identify with same email
      const response = await request(app)
        .post('/identify')
        .send({
          email: 'existing@example.com',
          phoneNumber: null
        });

      expect(response.status).toBe(200);
      expect(response.body.contact.emails).toContain('existing@example.com');
      expect(response.body.contact.phoneNumbers).toContain('1111111111');
    });

    it('should return existing contact when phone matches', async () => {
      // First create a contact
      await request(app)
        .post('/identify')
        .send({
          email: 'phone@example.com',
          phoneNumber: '2222222222'
        });

      // Then identify with same phone
      const response = await request(app)
        .post('/identify')
        .send({
          email: null,
          phoneNumber: '2222222222'
        });

      expect(response.status).toBe(200);
      expect(response.body.contact.emails).toContain('phone@example.com');
      expect(response.body.contact.phoneNumbers).toContain('2222222222');
    });
  });

  describe('Secondary Contact Creation', () => {
    it('should create secondary contact when same phone but different email', async () => {
      // Create primary contact
      await request(app)
        .post('/identify')
        .send({
          email: 'primary@example.com',
          phoneNumber: '3333333333'
        });

      // Create secondary contact with same phone but different email
      const response = await request(app)
        .post('/identify')
        .send({
          email: 'secondary@example.com',
          phoneNumber: '3333333333'
        });

      expect(response.status).toBe(200);
      expect(response.body.contact.emails).toHaveLength(2);
      expect(response.body.contact.emails).toContain('primary@example.com');
      expect(response.body.contact.emails).toContain('secondary@example.com');
      expect(response.body.contact.phoneNumbers).toEqual(['3333333333']);
      expect(response.body.contact.secondaryContactIds).toHaveLength(1);
    });
  });

  describe('Input Validation', () => {
    it('should reject request with no email or phone', async () => {
      const response = await request(app)
        .post('/identify')
        .send({
          email: null,
          phoneNumber: null
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/identify')
        .send({
          email: 'invalid-email',
          phoneNumber: '4444444444'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Primary Merging', () => {
    it('should merge two primary contacts when linked by new request', async () => {
      // Create first primary
      const firstResponse = await request(app)
        .post('/identify')
        .send({
          email: 'first@example.com',
          phoneNumber: '5555555555'
        });

      const firstPrimaryId = firstResponse.body.contact.primaryContatctId;

      // Create second primary with different email and phone
      const secondResponse = await request(app)
        .post('/identify')
        .send({
          email: 'second@example.com',
          phoneNumber: '6666666666'
        });

      const secondPrimaryId = secondResponse.body.contact.primaryContatctId;

      // Now link them with email from first and phone from second
      const mergeResponse = await request(app)
        .post('/identify')
        .send({
          email: 'first@example.com',
          phoneNumber: '6666666666'
        });

      expect(mergeResponse.status).toBe(200);
      expect(mergeResponse.body.contact.emails).toHaveLength(2);
      expect(mergeResponse.body.contact.phoneNumbers).toHaveLength(2);
      expect(mergeResponse.body.contact.secondaryContactIds).toHaveLength(1);
      
      // The older primary should remain primary
      expect(mergeResponse.body.contact.primaryContatctId).toBe(firstPrimaryId);
    });
  });
});
