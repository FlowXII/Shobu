import config from '../../config/startgg.config.js';
import { fetchGraphQLData } from '../../services/dashboard/dashboardFetch.js';
import User from '../../models/User.js';

const userInfoQuery = `
query UserInfoQuery {
  currentUser {
    name
    id
    bio
    genderPronoun
    location {
      city
      state
      country
      countryId
    }
    images {
      id
      type
      url
    }
    slug
    player {
      id
      gamerTag
      prefix
    }
  }
}`;

export const getAuthUrl = () => {
  const authUrl = new URL(config.startgg.authorizationUrl);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', config.startgg.clientId);
  authUrl.searchParams.append('redirect_uri', config.startgg.redirectUri);
  authUrl.searchParams.append('scope', config.startgg.scopes.join(' '));
  return authUrl.toString();
};

export const handleCallback = async (code, userId) => {
  try {
    console.log('🎮 Starting Start.gg OAuth callback process for user:', userId);
    
    // Get access token from Start.gg
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

    if (!tokenResponse.ok) {
      throw new Error('Failed to obtain access token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // Fetch user info from Start.gg
    const userInfoResponse = await fetchGraphQLData(access_token, userInfoQuery);
    const startggUserData = userInfoResponse.data?.currentUser;

    // Parse images if they're stringified
    let images = [];
    if (typeof startggUserData.images === 'string') {
      try {
        images = JSON.parse(startggUserData.images);
      } catch (e) {
        console.error('Failed to parse images:', e);
        images = [];
      }
    } else if (Array.isArray(startggUserData.images)) {
      images = startggUserData.images;
    }

    // Process images to ensure correct format
    const processedImages = images.map(img => ({
      id: String(img.id),
      type: String(img.type),
      url: String(img.url)
    }));

    console.log('Processed images:', JSON.stringify(processedImages, null, 2));

    // Update user document
    const updateData = {
      'startgg.connected': true,
      'startgg.accessToken': access_token,
      'startgg.refreshToken': refresh_token,
      'startgg.expiresAt': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      'startgg.tokenType': tokenData.token_type || 'Bearer',
      'startgg.scope': tokenData.scope || '',
      'startgg.userId': String(startggUserData.id),
      'startgg.slug': startggUserData.slug,
      'startgg.gamerTag': startggUserData.player?.gamerTag,
      'startgg.profile.bio': startggUserData.bio,
      'startgg.profile.genderPronoun': startggUserData.genderPronoun,
      'startgg.profile.location': startggUserData.location,
      'startgg.profile.images': processedImages
    };

    if (startggUserData.player) {
      updateData['startgg.player'] = {
        id: String(startggUserData.player.id),
        gamerTag: startggUserData.player.gamerTag,
        prefix: startggUserData.player.prefix
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        upsert: false
      }
    ).lean();

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    console.log('✅ Successfully updated user:', {
      userId: updatedUser._id,
      startggConnected: updatedUser.startgg?.connected,
      imagesCount: updatedUser.startgg?.profile?.images?.length
    });

    return { success: true };
  } catch (error) {
    console.error('❌ StartGG auth error:', {
      message: error.message,
      userId,
      stack: error.stack
    });
    throw error;
  }
};

// Add a disconnect function
export const disconnectStartGG = async (userId) => {
  try {
    console.log('🔌 Disconnecting Start.gg for user:', userId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $unset: { startgg: "" }
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    console.log('✅ Successfully disconnected Start.gg for user:', userId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error disconnecting Start.gg:', error);
    throw error;
  }
};
