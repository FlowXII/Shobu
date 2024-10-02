import React from 'react';
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";

const STARTGG_OAUTH_URL = "https://start.gg/oauth/authorize";
const CLIENT_ID = "YOUR_CLIENT_ID"; // Replace with your actual Start.gg client ID
const REDIRECT_URI = "http://localhost:3000/oauth/callback"; // Replace with your actual redirect URI

function Login() {
  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'user.identity tournament.read event.read' // Adjust scopes as needed
    });

    window.location.href = `${STARTGG_OAUTH_URL}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <CardBody className="flex flex-col items-center">
          <Typography variant="h4" color="blue-gray" className="mb-4">
            Login with Start.gg
          </Typography>
          <Typography color="gray" className="mt-1 mb-8 font-normal">
            Connect your Start.gg account to access tournament data.
          </Typography>
          <Button
            size="lg"
            color="blue"
            className="flex items-center gap-3"
            onClick={handleLogin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Login with Start.gg
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;
