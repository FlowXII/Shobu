import React from 'react';
import { Button } from '@material-tailwind/react';

function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center">
                <h1 className="text-5xl font-bold text-white mb-4">Shobu</h1>
                <p className="text-lg text-gray-200 mb-6">The future of competitive gaming</p>
                <Button color="lightBlue" size="lg" ripple="light">
                    Let's get it.
                </Button>
            </div>
        </div>
    );
}

export default Home;

