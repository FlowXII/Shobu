import React, { useEffect } from 'react';
import { Button } from '@material-tailwind/react';
import { subscribeUserToPush } from '../notificationService';

function Home() {
    useEffect(() => {
        const requestNotificationPermission = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    await subscribeUserToPush();
                } else {
                    console.log('Notification permission denied');
                }
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        };

        requestNotificationPermission();
    }, []);

    const sendTestNotification = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            if (!subscription) {
                await subscribeUserToPush();
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/send-test-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', response.status, errorText);
                throw new Error(`Failed to send test notification: ${response.status} ${errorText}`);
            }

            console.log('Test notification sent successfully');
        } catch (error) {
            console.error('Error sending test notification:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center">
                <h1 className="text-5xl font-bold text-white mb-4">Shobu</h1>
                <p className="text-lg text-gray-200 mb-6">The future of competitive gaming</p>
                <Button color="red" size="lg" onClick={sendTestNotification}>
                    Send Test Notification
                </Button>
            </div>
        </div>
    );
}

export default Home;

