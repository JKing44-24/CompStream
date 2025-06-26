import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, AlertCircle, CheckCircle } from 'lucide-react';

interface ExtensionStatus {
  status: 'enabled' | 'disabled';
  waiting: boolean;
}

const ExtensionPopup: React.FC = () => {
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus>({
    status: 'disabled',
    waiting: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.id) {
          const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });
          setExtensionStatus(response);
        }
      }
    } catch (error) {
      console.log('Not in extension context or tab not ready');
    }
    setIsLoading(false);
  };

  const toggleAutoClicker = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.id) {
          const response = await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
          setExtensionStatus(prev => ({
            ...prev,
            status: response.status
          }));
        }
      }
    } catch (error) {
      console.error('Failed to toggle auto-clicker:', error);
    }
  };

  const getStatusBadge = () => {
    if (extensionStatus.waiting) {
      return (
        <Badge className="bg-yellow-500 text-white">
          <AlertCircle className="w-3 h-3 mr-1" />
          Waiting for rebuild
        </Badge>
      );
    }
    
    if (extensionStatus.status === 'enabled') {
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary">
        Inactive
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-80">
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Famous.AI Auto-Clicker
        </CardTitle>
        <CardDescription>
          Automatically clicks "try to fix" after rebuilds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          {getStatusBadge()}
        </div>

        <Button
          onClick={toggleAutoClicker}
          className={`w-full shadow-lg transform hover:scale-105 transition-all duration-200 ${
            extensionStatus.status === 'enabled'
              ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
          }`}
        >
          {extensionStatus.status === 'enabled' ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Stop Auto-Clicker
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Auto-Clicker
            </>
          )}
        </Button>

        <div className="text-xs text-gray-600 text-center">
          Make sure you're on famous.ai for this to work
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtensionPopup;