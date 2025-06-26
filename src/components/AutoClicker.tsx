import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface AutoClickerProps {
  onStatusChange?: (status: string) => void;
  onClickCountChange?: (count: number) => void;
}

const AutoClicker: React.FC<AutoClickerProps> = ({ onStatusChange, onClickCountChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [interval, setInterval] = useState(2000);
  const [targetUrl, setTargetUrl] = useState('https://famous.ai');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startClicking = () => {
    if (intervalRef.current) return;
    
    setIsRunning(true);
    onStatusChange?.('Running');
    
    intervalRef.current = setInterval(() => {
      setClickCount(prev => {
        const newCount = prev + 1;
        onClickCountChange?.(newCount);
        return newCount;
      });
      
      console.log('Simulated click on "try to fix" button');
    }, interval);
  };

  const stopClicking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    onStatusChange?.('Stopped');
  };

  const resetCounter = () => {
    setClickCount(0);
    onClickCountChange?.(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Auto-Clicker Control
        </CardTitle>
        <CardDescription>
          Automatically clicks "try to fix" while you debug
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Target URL</Label>
          <Input
            id="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://famous.ai"
            className="border-2 focus:border-purple-400"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interval">Click Interval (ms)</Label>
          <Input
            id="interval"
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            min="500"
            max="10000"
            className="border-2 focus:border-purple-400"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Session Clicks:</span>
            <Badge variant="secondary" className="text-lg px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              {clickCount}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetCounter}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              onClick={startClicking}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Clicking
            </Button>
          ) : (
            <Button
              onClick={stopClicking}
              variant="destructive"
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop Clicking
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoClicker;