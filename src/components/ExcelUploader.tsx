import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface ExcelUploaderProps {
  onUpload: (data: any[]) => Promise<void>;
  isUploading: boolean;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onUpload, isUploading }) => {
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [processedRecords, setProcessedRecords] = useState(0);
  const [isPopulating, setIsPopulating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const populateDatabase = async () => {
    setIsPopulating(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setProcessedRecords(0);
    setLogs([]);
    
    try {
      let offset = 0;
      let hasMore = true;
      let totalProcessed = 0;
      let batchCount = 0;
      const maxBatches = 500; // Safety limit
      
      addLog('Starting database population...');
      
      while (hasMore && batchCount < maxBatches) {
        addLog(`Processing batch ${batchCount + 1}, offset: ${offset}`);
        
        const response = await fetch(
          'https://rulecbxokfrwbgzoaljn.supabase.co/functions/v1/eca385d0-7d57-4d21-aa1b-c8d221841dd6',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ offset })
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        addLog(`Batch result: ${result.success ? 'SUCCESS' : 'FAILED'}, count: ${result.count}`);
        
        if (!result.success) {
          throw new Error(result.error || 'Unknown error occurred');
        }
        
        totalProcessed += result.count;
        setProcessedRecords(totalProcessed);
        
        // Estimate total records based on first successful batch
        if (totalRecords === 0 && result.count > 0) {
          setTotalRecords(300000); // Conservative estimate
        }
        
        // Update progress
        if (totalRecords > 0) {
          setProgress(Math.min((totalProcessed / totalRecords) * 100, 95));
        }
        
        hasMore = result.hasMore && result.count > 0;
        
        if (!hasMore || result.count === 0) {
          addLog('No more records to process');
          break;
        }
        
        offset += 1000;
        batchCount++;
        
        // Add delay between batches to avoid overwhelming the API
        if (hasMore) {
          addLog('Waiting before next batch...');
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      if (batchCount >= maxBatches) {
        addLog(`Reached maximum batch limit (${maxBatches})`);
      }
      
      setProgress(100);
      setSuccess(true);
      addLog(`Population complete! Total records processed: ${totalProcessed}`);
      await onUpload([]);
      
    } catch (err) {
      const errorMessage = 'Error populating database: ' + (err as Error).message;
      addLog(`ERROR: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Populate Database with Complete Dataset
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-lg font-medium mb-4">
            Load Complete Allegheny County Property Data
          </p>
          <p className="text-gray-500 mb-6">
            This will fetch and populate the database with the complete property dataset from Allegheny County, including all available data fields.
          </p>
          
          <Button 
            onClick={populateDatabase} 
            disabled={isPopulating || isUploading}
            size="lg"
            className="mb-4"
          >
            {isPopulating ? 'Populating Database...' : 'Start Complete Data Population'}
          </Button>
        </div>

        {isPopulating && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{processedRecords.toLocaleString()} records processed</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-gray-500 text-center">
              Populating complete dataset - this will take several minutes...
            </p>
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium mb-2">Processing Log:</h4>
            <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-gray-600">{log}</div>
              ))}
            </div>
          </div>
        )}

        {success && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully populated database with {processedRecords.toLocaleString()} complete property records!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};