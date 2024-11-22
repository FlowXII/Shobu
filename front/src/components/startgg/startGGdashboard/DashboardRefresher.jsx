import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Typography } from "@material-tailwind/react";

const REFRESH_INTERVAL = 10000; // 10 seconds

const DashboardRefresher = ({ onRefresh }) => {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(REFRESH_INTERVAL);

  const refreshData = useCallback(() => {
    onRefresh();
    setTimeUntilRefresh(REFRESH_INTERVAL);
  }, [onRefresh]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh((prevTime) => {
        if (prevTime <= 1000) {
          refreshData();
          return REFRESH_INTERVAL;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshData]);

  return (
    <div className="flex items-center justify-end">
      <Spinner className="h-3 w-3 text-blue-500" />
      <Typography className="ml-1 text-xs">{Math.ceil(timeUntilRefresh / 1000)}s</Typography>
    </div>
  );
};

export default DashboardRefresher;
