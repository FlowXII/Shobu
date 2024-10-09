import express from 'express';
import webpush from 'web-push';

const pushNotificationsRoute = express.Router();

// VAPID keys should be securely stored in environment variables
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } = process.env;

// Check if VAPID keys are available
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_EMAIL) {
  console.error('VAPID keys are missing in the environment variables!');
  process.exit(1);
}

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  `mailto:${VAPID_EMAIL}`,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Subscription route with security improvements
pushNotificationsRoute.post('/subscribe', async (req, res) => {
  const subscription = req.body;

  // Validate the subscription object
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription object' });
  }

  const payload = JSON.stringify({ title: 'Test notification' });

  try {
    await webpush.sendNotification(subscription, payload);
    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

pushNotificationsRoute.post('/send-test-notification', async (req, res) => {
  const subscription = req.body.subscription;
  if (!subscription) {
    console.error('No subscription object received');
    return res.status(400).json({ error: 'No subscription object received' });
  }

  const payload = JSON.stringify({
    title: 'Test Notification',
    body: 'This is a test push notification'
  });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log('Test notification sent successfully');
    res.status(200).json({ message: 'Test notification sent successfully' });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: `Failed to send test notification: ${error.message}`, stack: error.stack });
  }
});

export default pushNotificationsRoute;
