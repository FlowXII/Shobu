import jwt from 'jsonwebtoken';
import config from '../../config/startgg.config.js';

// Generate auth URL
export const getAuthUrl = () => {
  const authUrl = new URL(config.startgg.authorizationUrl);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', config.startgg.clientId);
  authUrl.searchParams.append('redirect_uri', config.startgg.redirectUri);
  authUrl.searchParams.append('scope', config.startgg.scopes.join(' '));
  
  return authUrl.toString();
};

// Handle OAuth callback and generate JWT
export const handleCallback = async (code) => {
  try {
    const tokenResponse = await fetch(config.startgg.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: config.startgg.clientId,
        client_secret: config.startgg.clientSecret,
        code,
        redirect_uri: config.startgg.redirectUri
      })
    });

    const { access_token, refresh_token } = await tokenResponse.json();

    // Create JWT with StartGG tokens
    const token = jwt.sign(
      { 
        startgg_access_token: access_token,
        startgg_refresh_token: refresh_token 
      },
      config.startgg.jwtSecret,
      { expiresIn: '7d' }
    );

    return token;
  } catch (error) {
    console.error('StartGG auth error:', error);
    throw new Error('Authentication failed');
  }
};