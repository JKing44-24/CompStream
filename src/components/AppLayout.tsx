import React, { useState } from 'react';
import { RealEstateApp } from './RealEstateApp';
import { LocalRealEstateApp } from './LocalRealEstateApp';
import AuthGuard from './AuthGuard';
import AutoDataPopulator from './AutoDataPopulator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, HardDrive, ArrowRight } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [mode, setMode] = useState<'select' | 'supabase' | 'local'>('select');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dataPopulated, setDataPopulated] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleDataPopulated = () => {
    setDataPopulated(true);
  };

  // Show auth guard first
  if (!isAuthenticated) {
    return <AuthGuard onAuthenticated={handleAuthenticated}>{null}</AuthGuard>;
  }

  // Show data populator after auth but before app
  if (isAuthenticated && !dataPopulated && mode === 'supabase') {
    return <AutoDataPopulator onComplete={handleDataPopulated} />;
  }

  if (mode === 'supabase') {
    return (
      <AuthGuard onAuthenticated={handleAuthenticated}>
        <div className="min-h-screen">
          <div className="p-4">
            <Button 
              onClick={() => setMode('select')} 
              variant="outline" 
              className="mb-4"
            >
              ← Back to Mode Selection
            </Button>
          </div>
          <RealEstateApp />
        </div>
      </AuthGuard>
    );
  }

  if (mode === 'local') {
    return (
      <AuthGuard onAuthenticated={handleAuthenticated}>
        <div className="min-h-screen">
          <div className="p-4">
            <Button 
              onClick={() => setMode('select')} 
              variant="outline" 
              className="mb-4"
            >
              ← Back to Mode Selection
            </Button>
          </div>
          <LocalRealEstateApp />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard onAuthenticated={handleAuthenticated}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Allegheny County Real Estate Sales Data Search
            </h1>
            <p className="text-gray-600 text-lg">
              Select how you want to store and manage your real estate data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setMode('supabase')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  Supabase Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Use Supabase as your backend database for persistent, scalable data storage.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <span>✓</span> Persistent data storage
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <span>✓</span> Scalable and secure
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <span>✓</span> Multi-user support
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <span>!</span> Requires database setup
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => setMode('supabase')}>
                    Use Supabase <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setMode('local')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <HardDrive className="h-6 w-6 text-green-600" />
                  </div>
                  Local Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Store data locally in your browser - no database setup required!
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <span>✓</span> No setup required
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <span>✓</span> Works offline
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <span>✓</span> Fast performance
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <span>!</span> Data limited to this browser
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => setMode('local')}>
                    Use Local Storage <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              You can switch between modes at any time
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AppLayout;