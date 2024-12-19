import logger from './logger.js';

const sendResponse = ({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
  meta
}) => {
  const response = {
    success,
    ...(message && { message }),
    ...(data && { data }),
    ...(meta && { meta })
  };

  logger.debug('Sending response', { 
    statusCode, 
    ...response 
  });

  return res.status(statusCode).json(response);
};

// Success responses
export const sendCreatedResponse = ({ 
  res, 
  data, 
  message = 'Resource created successfully' 
}) => {
  return sendResponse({ 
    res, 
    statusCode: 201, 
    data, 
    message 
  });
};

export const sendSuccessResponse = ({ 
  res, 
  data, 
  message 
}) => {
  return sendResponse({ 
    res, 
    data, 
    message 
  });
};

export const sendUpdatedResponse = ({ 
  res, 
  data, 
  message = 'Resource updated successfully' 
}) => {
  return sendResponse({ 
    res, 
    data, 
    message 
  });
};

export const sendDeletedResponse = ({ 
  res, 
  message = 'Resource deleted successfully' 
}) => {
  return sendResponse({ 
    res, 
    message 
  });
};

export const sendListResponse = ({ 
  res, 
  data, 
  meta 
}) => {
  return sendResponse({ 
    res, 
    data, 
    meta 
  });
}; 