import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, Zap } from 'lucide-react';

const Instructions: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="w-5 h-5 text-blue-500" />
          How to Use
        </CardTitle>
        <CardDescription>
          Quick setup guide for auto-clicking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 min-w-[24px] h-6 flex items-center justify-center text-xs">
              1
            </Badge>
            <p className="text-sm text-gray-600 flex-1">
              Enter the Famous.AI URL in the target field
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 min-w-[24px] h-6 flex items-center justify-center text-xs">
              2
            </Badge>
            <p className="text-sm text-gray-600 flex-1">
              Set your preferred click interval (2-10 seconds recommended)
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 min-w-[24px] h-6 flex items-center justify-center text-xs">
              3
            </Badge>
            <p className="text-sm text-gray-600 flex-1">
              Click "Start Clicking" and continue debugging your app
            </p>
          </div>
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-xs">
            <strong>Note:</strong> This is a simulation. For actual web automation, you'd need a browser extension.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <Zap className="w-4 h-4 text-indigo-600" />
          <span className="text-xs text-indigo-700 font-medium">
            Pro tip: Use longer intervals to avoid overwhelming the server
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Instructions;