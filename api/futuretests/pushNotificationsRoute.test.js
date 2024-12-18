import request from 'supertest';
import express from 'express';
import webpush from 'web-push';
import pushNotificationsRoute from '../../routes/pushNotificationsRoute.js';

// Mock web-push
jest.mock('web-push');

const app = express();
app.use(express.json());
app.use('/api/notifications', pushNotificationsRoute);

describe.skip('Push Notifications Routes', () => {
  const mockSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/mock-endpoint',
    keys: {
      p256dh: 'mock-p256dh-key',
      auth: 'mock-auth-key'
    }
  };

  beforeEach(() => {
    webpush.sendNotification.mockClear();
  });

  it('should send a test notification successfully', async () => {
    webpush.sendNotification.mockResolvedValue();

    const response = await request(app)
      .post('/api/notifications/send-test-notification')
      .send({ subscription: mockSubscription });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Test notification sent successfully');
    expect(webpush.sendNotification).toHaveBeenCalled();
  });

  it('should handle missing subscription data', async () => {
    const response = await request(app)
      .post('/api/notifications/send-test-notification')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No subscription object received');
  });
}); 