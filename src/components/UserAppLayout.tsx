import React, { useState, useEffect } from 'react';
import { RealEstateApp } from './RealEstateApp';
import UserAuth from './UserAuth';

const UserAppLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = localStorage.getItem('userAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('userEmail');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <UserAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen">
      <UserAuth 
        onAuthenticated={handleAuthenticated} 
        onLogout={handleLogout}
        isAuthenticated={true}
      >
        <RealEstateApp />
      </UserAuth>
    </div>
  );
};

export default UserAppLayout;