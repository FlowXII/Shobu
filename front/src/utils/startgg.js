export const isStartGGConnected = (user) => {
  return !!(
    user?.startgg?.accessToken && 
    user?.startgg?.connected && 
    !isTokenExpired(user?.startgg?.expiresAt)
  );
};

const isTokenExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return new Date(expiresAt) <= new Date();
}; 