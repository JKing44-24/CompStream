import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, CreditCard } from 'lucide-react';

interface UserAuthProps {
  children?: React.ReactNode;
  onAuthenticated: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

const UserAuth: React.FC<UserAuthProps> = ({ children, onAuthenticated, onLogout, isAuthenticated = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email && password && password.length >= 6) {
      localStorage.setItem('userAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      onAuthenticated();
    } else {
      setError('Please enter valid credentials (password must be at least 6 characters)');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setEmail('');
    setPassword('');
  };

  if (isAuthenticated && children) {
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    return (
      <div>
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Subscription Active - {userEmail}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Sign In</CardTitle>
          <p className="text-sm text-gray-600">Access Real Estate Database</p>
          <div className="mt-2 p-2 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-sm text-green-700">
              <CreditCard className="h-4 w-4" />
              <span>Subscription Required</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAuth;