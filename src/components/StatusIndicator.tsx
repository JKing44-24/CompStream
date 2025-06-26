import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: string;
  clickCount: number;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, clickCount }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'stopped':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'running':
        return <Activity className="w-4 h-4 animate-pulse" />;
      case 'stopped':
        return <XCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <Badge 
                variant="outline" 
                className={`${getStatusColor()} text-white border-0`}
              >
                {status}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Total Clicks</p>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {clickCount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusIndicator;