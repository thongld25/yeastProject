import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
