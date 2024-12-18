import request from 'supertest';
import mongoose from 'mongoose';
import index from '../../index.js';
import User from '../../models/User.js';
import Tournament from '../../models/Tournament.js';
import logger from '../../utils/logger';

describe('Tournament Routes', () => {
  let testUser;
  let testToken;
  let testTournament;

  beforeEach(async () => {
    const uniqueSuffix = Date.now();
    testUser = await User.create({
      username: `testuser${uniqueSuffix}`,
      email: `test${uniqueSuffix}@example.com`,
      password: 'password123'
    });
    testToken = global.generateTestToken(testUser._id);

    testTournament = await Tournament.create({
      name: 'Test Tournament',
      description: 'Test Description',
      startAt: new Date(Date.now() + 1000 * 60 * 60),
      registrationStartAt: new Date(Date.now() - 1000 * 60 * 60),
      registrationEndAt: new Date(Date.now() + 1000 * 30 * 60),
      location: 'Test Location',
      type: 'SINGLE_ELIMINATION',
      organizerId: testUser._id
    });

    logger.info('Test setup complete', {
      testUser: {
        id: testUser._id,
        username: testUser.username,
        email: testUser.email
      },
      testTournament: {
        id: testTournament._id,
        name: testTournament.name
      }
    });
  });

  afterEach(async () => {
    await User.deleteMany();
    await Tournament.deleteMany();
  });

  describe('GET /api/tournaments', () => {
    it('should return all tournaments', async () => {
      const response = await request(index)
        .get('/api/tournaments');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Test Tournament');
    });
  });

  describe('GET /api/tournaments/:id', () => {
    it('should return a specific tournament', async () => {
      const response = await request(index)
        .get(`/api/tournaments/${testTournament._id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Test Tournament');
    });

    it('should return 404 for non-existent tournament', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(index)
        .get(`/api/tournaments/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/tournaments/create', () => {
    it('should create a new tournament when authenticated', async () => {
      const newTournament = {
        name: 'New Tournament',
        slug: 'new-tournament',
        description: 'New Description',
        startAt: new Date(),
        location: 'New Location',
        type: 'single-elimination',
        registrationStartAt: new Date(Date.now() - 1000 * 60 * 60),
        registrationEndAt: new Date(Date.now() + 1000 * 60 * 60)
      };
      console.log(newTournament);

      const response = await request(index)
        .post('/api/tournaments/create')
        .set('Cookie', `jwt=${testToken}`)
        .send(newTournament);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('New Tournament');
      expect(response.body.data.organizerId).toBe(testUser._id.toString());
    });

    it('should reject tournament creation when not authenticated', async () => {
      const newTournament = {
        name: 'New Tournament',
        description: 'New Description',
        startAt: new Date(),
        location: 'New Location'
      };

      const response = await request(index)
        .post('/api/tournaments/create')
        .send(newTournament);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/tournaments/:id/register', () => {
    it('should register a new user for the tournament', async () => {
      const newUser = await User.create({
        username: `newuser${Date.now()}`,
        email: `newuser${Date.now()}@example.com`,
        password: 'password123'
      });
      const newUserToken = global.generateTestToken(newUser._id);

      logger.info('New user created for registration test', {
        newUser: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email
        }
      });

      const response = await request(index)
        .post(`/api/tournaments/${testTournament._id}/register`)
        .set('Cookie', `jwt=${newUserToken}`);

      logger.info('Response from registration attempt', {
        status: response.status,
        body: response.body
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.attendees).toContainEqual(
        expect.objectContaining({ userId: newUser._id.toString() })
      );
    });

    it('should check in the registered user', async () => {
      const newUser = await User.create({
        username: `newuser${Date.now()}`,
        email: `newuser${Date.now()}@example.com`,
        password: 'password123'
      });
      const newUserToken = global.generateTestToken(newUser._id);

      await request(index)
        .post(`/api/tournaments/${testTournament._id}/register`)
        .set('Cookie', `jwt=${newUserToken}`);

      logger.info('New user registered for check-in test', {
        newUser: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email
        }
      });

      const response = await request(index)
        .post(`/api/tournaments/${testTournament._id}/check-in/${newUser._id}`)
        .set('Cookie', `jwt=${testToken}`);

      logger.info('Response from check-in attempt', {
        status: response.status,
        body: response.body
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.checkedInAttendees).toContainEqual(
        expect.objectContaining({ userId: newUser._id.toString() })
      );
    });
  });
}); 