import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, supabaseUrl, supabaseKey } from '@/lib/supabase';

export const DataPopulator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const populateData = async () => {
    setIsLoading(true);
    setProgress(0);
    setStatus('idle');
    setMessage('Starting comprehensive data population for all Allegheny County municipalities...');

    try {
      let offset = 0;
      const batchSize = 1000;
      let totalProcessed = 0;
      let hasMore = true;
      const maxRecords = 200000;

      while (hasMore && offset < maxRecords) {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        console.log('Making request to:', `${supabaseUrl}/functions/v1/0b3dd79d-9439-4e95-86d8-cb91a66cdced`);
        
        const response = await fetch(
          `${supabaseUrl}/functions/v1/0b3dd79d-9439-4e95-86d8-cb91a66cdced`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token || supabaseKey}`,
              'apikey': supabaseKey
            },
            body: JSON.stringify({ offset })
          }
        );

        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', response.status, response.statusText, errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Batch result:', result);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to populate data');
        }

        totalProcessed += result.count;
        offset += batchSize;
        hasMore = result.hasMore && result.count > 0;
        
        setProgress(Math.min((offset / maxRecords) * 100, 100));
        setMessage(`Processed ${totalProcessed} properties from all municipalities...`);
        
        if (!hasMore || result.count === 0) break;
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setStatus('success');
      setMessage(`Successfully populated ${totalProcessed} properties from all Allegheny County municipalities!`);
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`Error populating database: ${JSON.stringify({message: errorMessage, stack: error instanceof Error ? error.stack : undefined})}`);
      console.error('Full error details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
          Populate All Municipalities
        </CardTitle>
        <CardDescription>
          Load comprehensive property data from every Allegheny County municipality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={populateData} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Populating All Municipalities...' : 'Populate All County Data'}
        </Button>
        
        {isLoading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {progress.toFixed(0)}% complete
            </p>
          </div>
        )}
        
        {message && (
          <Alert className={status === 'error' ? 'border-red-200' : ''}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};