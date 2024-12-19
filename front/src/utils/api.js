export async function fetchWithCredentials(url, options = {}) {
  try {
    console.log('fetchWithCredentials - Starting request:', {
      url,
      options,
      fullUrl: `${import.meta.env.VITE_API_BASE_URL}${url}`
    });

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include',
    });
    
    const data = await response.json();
    
    console.log('fetchWithCredentials - Response:', {
      status: response.status,
      ok: response.ok,
      data
    });
    
    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch: ${url}`);
    }
    
    return data.data;
  } catch (error) {
    console.error('fetchWithCredentials - Error:', {
      error,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
} 