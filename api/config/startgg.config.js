const config = {
        startgg: {
          authorizationUrl: 'https://start.gg/oauth/authorize',
          tokenUrl: 'https://api.start.gg/oauth/access_token',
          refreshTokenUrl: 'https://api.start.gg/oauth/refresh',
          clientId: process.env.STARTGG_CLIENT_ID,
          clientSecret: process.env.STARTGG_CLIENT_SECRET,
          redirectUri: process.env.STARTGG_REDIRECT_URI,
          scopes: ['user.identity', 'user.email', 'tournament.manager', 'tournament.reporter']
        }
      };
      
      export default config;