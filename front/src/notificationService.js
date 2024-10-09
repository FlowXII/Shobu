const publicVapidKey = 'BMMsDUJXifYYR995-NeZwB7Uo1c6-cIjJw5U3hYoORRIuMJ6ZyuZLX092xyE3CHjrdF3gNnoWSs2bHpuouA88rg';

export async function subscribeUserToPush() {
  try {
    // Ensure the service worker is registered
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registered with scope:', registration.scope);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('User subscribed to push notifications');
  } catch (error) {
    console.error('Failed to subscribe user to push notifications:', error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
