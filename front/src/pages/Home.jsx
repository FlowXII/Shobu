import React from 'react';
import { Button, Typography, Card, CardBody } from '@material-tailwind/react';
import { Trophy, Users, Presentation, Tv, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeUserToPush } from '../notificationService';
import { useSelector } from 'react-redux';

function Home() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted');
                await subscribeUserToPush();
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };

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
                throw new Error(`Failed to send test notification: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending test notification:', error);
        }
    };

    const features = [
        {
            icon: Trophy,
            title: "Tournament Management",
            description: "Track and manage your tournaments with ease. Get real-time updates on brackets and matches.",
            color: "text-red-400"
        },
        {
            icon: Presentation,
            title: "Station Management",
            description: "Efficiently manage tournament stations. Track matches and player assignments in real-time.",
            color: "text-red-500"
        },
        {
            icon: Users,
            title: "Community Integration",
            description: "Connect with the FGC community. Follow players, share achievements, and stay updated.",
            color: "text-blue-500"
        },
        {
            icon: Tv,
            title: "Stream Integration",
            description: "Seamlessly integrate with streaming platforms. Manage stream queues and schedules.",
            color: "text-purple-500"
        }
    ];

    return (
        <div className="min-h-screen text-white">
            {/* Notification Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                    color="blue" 
                    size="sm" 
                    variant="outlined"
                    className="flex items-center gap-2 hover:bg-blue-500/10 transition-colors" 
                    onClick={requestNotificationPermission}
                >
                    <Bell className="h-4 w-4" />
                    Enable Notifications
                </Button>
                <Button 
                    color="red" 
                    size="sm" 
                    variant="outlined"
                    className="flex items-center gap-2" 
                    onClick={sendTestNotification}
                >
                    Test Notification
                </Button>
            </div>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400 drop-shadow-lg">
                    Shobu
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                    Revolutionizing tournament management for the Fighting Game Community
                </p>
                <div className="flex gap-4">
                    <Link to={isAuthenticated ? "/tournaments/create" : "/register"}>
                        <Button size="lg" color="red" className="flex items-center gap-2">
                            Get Started
                        </Button>
                    </Link>
                    <Link to="/tournaments">
                        <Button size="lg" variant="outlined" color="white">
                            Browse Tournaments
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <Typography variant="h3" className="text-center mb-12 text-gray-100">
                    Features
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors">
                            <CardBody className="flex flex-col items-center text-center p-6">
                                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                                <Typography variant="h5" className="mb-3 text-gray-100">
                                    {feature.title}
                                </Typography>
                                <Typography color="gray" className="font-normal text-gray-300">
                                    {feature.description}
                                </Typography>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            {/* New Section: Community Highlights */}
            <div className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <Typography variant="h3" className="text-center text-white mb-12">
                        Community Highlights
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Example Community Highlight */}
                        <Card className="bg-gray-800 border border-white/10">
                            <CardBody className="flex flex-col items-center text-center">
                                <Users className="w-12 h-12 text-blue-500 mb-4" />
                                <Typography variant="h5" className="mb-2 text-white">
                                    Player of the Month
                                </Typography>
                                <Typography color="gray" className="font-normal text-white">
                                    Meet our top player who has dominated the tournaments this month.
                                </Typography>
                            </CardBody>
                        </Card>
                        {/* Additional Placeholder Highlight */}
                        <Card className="bg-gray-800 border border-white/10">
                            <CardBody className="flex flex-col items-center text-center">
                                <Trophy className="w-12 h-12 text-red-500 mb-4" />
                                <Typography variant="h5" className="mb-2 text-white">
                                    Tournament of the Month
                                </Typography>
                                <Typography color="gray" className="font-normal text-white">
                                    Discover the most exciting tournament that took place recently.
                                </Typography>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center py-16 px-4 bg-gray-900/90">
                <Typography variant="h3" className="mb-4 text-gray-100">
                    Ready to Level Up Your Tournament?
                </Typography>
                <Typography className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Join the growing community of tournament organizers and players using Shobu
                </Typography>
                <Link to="/register">
                    <Button size="lg" color="red" className="flex items-center gap-2 mx-auto">
                        Sign Up Now
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Home;

