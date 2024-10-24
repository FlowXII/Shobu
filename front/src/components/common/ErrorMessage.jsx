import React from 'react';
import { Typography } from '@material-tailwind/react';

const ErrorMessage = ({ error }) => (
  <Typography className="mb-4 text-red-700">
    Error: {error}
    <br />
    Please check the console for more details.
  </Typography>
);

export default ErrorMessage;
