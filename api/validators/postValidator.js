export const validatePost = ({ content }) => {
  if (content && content.length > 5000) {
    return 'Content exceeds maximum length of 5000 characters';
  }

  return null;
}; 