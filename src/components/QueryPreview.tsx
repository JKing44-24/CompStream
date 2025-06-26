import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchFiltersComponent } from './SearchFilters';
import { Home, Search, Database } from 'lucide-react';

const QueryPreview: React.FC = () => {
  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters);
  };

  const handleClear = () => {
    console.log('Clear search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Allegheny County Real Estate Search
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Search and export property sales records
          </p>
        </div>

        <div className="space-y-6">
          <SearchFiltersComponent 
            onSearch={handleSearch} 
            onClear={handleClear} 
          />
          
          <Card className="border-dashed border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-500">
                <Database className="h-5 w-5" />
                Search Results Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter search criteria above to see results</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueryPreview;