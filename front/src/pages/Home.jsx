import React from 'react';
import { Button, Typography, Card, CardBody } from '@material-tailwind/react';
import { Trophy, Users, Presentation, Tv, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeUserToPush } from '../notificationService';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const features = [
        {
            icon: Trophy,
            title: "Tournament Management",
            description: "Track and manage your tournaments with ease. Get real-time updates on brackets, stations, and matches.",
            color: "text-red-500",
            glow: "from-red-500/20 to-red-600/20"
        },
        {
            icon: Users,
            title: "Community Integration",
            description: "Connect with the FGC community. Follow players and organizers, share achievements, and stay updated !",
            color: "text-blue-500",
            glow: "from-blue-500/20 to-blue-600/20"
        },
        {
            icon: Tv,
            title: "Stream Integration",
            description: "Seamlessly integrate with streaming platforms to check on your favorite players or your favorite tournaments !",
            color: "text-purple-500",
            glow: "from-purple-500/20 to-purple-600/20"
        },
        {
            icon: Presentation,
            title: "Start.GG Support",
            description: "Through the Start.GG API, history and champions crowned are kept and integrated in Shobu",
            color: "text-yellow-500",
            glow: "from-yellow-500/20 to-yellow-600/20"
        }
    ];

    return (
        <div className="min-h-screen text-white overflow-hidden">
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
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative"
            >
                {/* Animated background glow */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 blur-3xl"
                />

                <motion.h1 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-7xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 drop-shadow-lg relative"
                >
                    Shobu
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-3xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
                >
                    Elevate Your Fighting Game Tournaments to the Next Level
                </motion.p>

                <div className="flex gap-2">
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
            </motion.div>

            {/* Features Section */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-4 py-16 -mt-20 relative z-10"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative inline-block"
                    >
                        <Typography variant="h3" className="text-gray-100 relative z-10">
                            Features
                        </Typography>
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-full"></div>
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-full blur-xl"></div>
                    </motion.div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            className="relative group h-full"
                        >
                            {/* Glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl blur group-hover:blur-md transition-all duration-300" />
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.glow} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <Card className="bg-gray-800/90 border border-gray-700 hover:border-gray-600 transition-all duration-300 backdrop-blur-sm relative h-full">
                                <CardBody className="flex flex-col items-center text-center p-6 h-full">
                                    <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                                    <Typography 
                                        variant="h5" 
                                        className="mb-3 text-gray-100 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-white"
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography color="gray" className="font-normal text-gray-300">
                                        {feature.description}
                                    </Typography>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* New Section: Community Highlights */}
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 py-16 relative"
            >
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
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
            </motion.div>

            {/* CTA Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center py-24 px-4 bg-gradient-to-b from-gray-900/90 to-gray-950/90 relative"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 blur-3xl"
                />
                
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
            </motion.div>
        </div>
    );
}

export default Home;

