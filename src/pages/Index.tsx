import React from 'react';
import UserAppLayout from '@/components/UserAppLayout';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <UserAppLayout />
    </AppProvider>
  );
};

export default Index;