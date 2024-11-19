import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Typography, Card, CardBody } from "@material-tailwind/react";

const EventDebugRoute = () => {
    const params = useParams();
    const location = useLocation();

    return (
        <Card className="bg-gray-900 text-white mb-4">
            <CardBody>
                <Typography variant="h6" className="mb-2">Route Debug Info</Typography>
                <pre className="bg-gray-800 p-4 rounded-lg overflow-auto">
                    {JSON.stringify({
                        params,
                        pathname: location.pathname,
                        search: location.search,
                        state: location.state
                    }, null, 2)}
                </pre>
            </CardBody>
        </Card>
    );
};

export default EventDebugRoute; 