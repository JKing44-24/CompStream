import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';

interface BulkDataPopulatorProps {
  onComplete: () => void;
}

const BulkDataPopulator: React.FC<BulkDataPopulatorProps> = ({ onComplete }) => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const populateAllData = async () => {
    setIsPopulating(true);
    setStatus('running');
    setProgress(0);
    setCurrentBatch(0);
    setTotalRecords(0);
    setMessage('Starting complete data population...');

    try {
      const functionUrl = 'https://rulecbxokfrwbgzoaljn.supabase.co/functions/v1/0b3dd79d-9439-4e95-86d8-cb91a66cdced';
      let offset = 0;
      let hasMore = true;
      let totalInserted = 0;
      let apiTotalRecords = 0;
      const batchSize = 1000;

      // Start with full refresh
      setMessage('Clearing existing data for fresh start...');
      
      while (hasMore) {
        const batchNum = Math.floor(offset / batchSize) + 1;
        setCurrentBatch(batchNum);
        setMessage(`Processing batch ${batchNum} (offset: ${offset.toLocaleString()})...`);
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            offset, 
            fullRefresh: offset === 0 // Only refresh on first batch
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Unknown error occurred');
        }

        totalInserted += result.count;
        apiTotalRecords = result.totalRecords || apiTotalRecords;
        
        setTotalRecords(totalInserted);
        
        // Calculate actual progress based on API total
        if (apiTotalRecords > 0) {
          const progressPercent = Math.min((totalInserted / apiTotalRecords) * 100, 100);
          setProgress(progressPercent);
        }
        
        setMessage(`Processed ${totalInserted.toLocaleString()} of ${apiTotalRecords.toLocaleString()} properties...`);
        
        hasMore = result.hasMore && result.count > 0;
        offset = result.nextOffset || (offset + batchSize);
        
        // Small delay to prevent API overwhelming
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setProgress(100);
      setStatus('complete');
      setMessage(`Successfully populated ALL ${totalInserted.toLocaleString()} Allegheny County properties!`);
      
      setTimeout(() => {
        onComplete();
      }, 3000);
      
    } catch (error) {
      console.error('Error during bulk population:', error);
      setStatus('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsPopulating(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Database className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Database Population</h2>
        <p className="text-gray-600">Populate database with ALL Allegheny County properties from WPRDC API</p>
      </div>

      {status === 'idle' && (
        <div className="text-center space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              This will populate the database with every single property record available from the WPRDC API.
              The process may take several minutes to complete.
            </p>
          </div>
          <Button 
            onClick={populateAllData} 
            disabled={isPopulating}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Database className="mr-2 h-5 w-5" />
            Populate ALL Properties
          </Button>
        </div>
      )}

      {status !== 'idle' && (
        <Alert variant={status === 'error' ? 'destructive' : 'default'}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <AlertDescription className="flex-1">{message}</AlertDescription>
          </div>
        </Alert>
      )}

      {status === 'running' && (
        <div className="space-y-3">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Batch: {currentBatch}</span>
            <span>Records: {totalRecords.toLocaleString()}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkDataPopulator;