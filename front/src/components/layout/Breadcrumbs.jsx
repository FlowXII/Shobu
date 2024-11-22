import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex text-gray-500 text-sm mb-4">
      <Link to="/" className="hover:text-red-500">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={to} className="flex items-center">
            <span className="mx-2">/</span>
            {isLast ? (
              <span className="text-gray-700">{value}</span>
            ) : (
              <Link to={to} className="hover:text-red-500">
                {value}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs; 