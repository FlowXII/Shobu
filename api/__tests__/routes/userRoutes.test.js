import request from 'supertest';
import index from '../../index'; // Ensure this is the correct path to your main file
import mongoose from 'mongoose';
import User from '../../models/User';

describe('User Routes', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Only clear users if not needed for subsequent tests
    if (!userId) {
      await User.deleteMany();
    }
  });

  it('should register a new user', async () => {
    const response = await request(index)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('userId');
    userId = response.body.data.userId; // Save userId for later use
  });

  it('should login a user', async () => {
    // First, register a user
    await request(index)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });

    // Then, login
    const response = await request(index)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('user');
    token = response.headers['set-cookie'][0].split(';')[0].split('=')[1]; // Extract token from cookie
  });

  it('should get the current user profile', async () => {
    const response = await request(index)
      .get('/api/users/profile/me')
      .set('Cookie', `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('username', 'testuser');
  });

  it('should update the user profile', async () => {
    const response = await request(index)
      .patch('/api/users/profile')
      .set('Cookie', `jwt=${token}`)
      .send({
        bio: 'Updated bio'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('bio', 'Updated bio');
  });

  it('should logout the user', async () => {
    const response = await request(index)
      .post('/api/users/logout')
      .set('Cookie', `jwt=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
}); 