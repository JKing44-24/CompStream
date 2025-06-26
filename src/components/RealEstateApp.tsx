import { useState } from 'react';
import { SearchFiltersComponent } from './SearchFilters';
import { PropertySelector } from './PropertySelector';
import { ExportDialog } from './ExportDialog';
import { SearchResultsSummary } from './SearchResultsSummary';
import { useRealEstateData } from '@/hooks/useRealEstateData';
import { Property } from '@/types/RealEstate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Search, FileText } from 'lucide-react';

export const RealEstateApp = () => {
  const { properties, loading, searchProperties, clearSearch } = useRealEstateData();
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

  const handleSearch = (filters: any) => {
    searchProperties(filters);
    setHasSearched(true);
  };

  const handleClear = () => {
    clearSearch();
    setHasSearched(false);
    setSelectedProperties([]);
  };

  const handleExportSelected = (selected: Property[]) => {
    setSelectedProperties(selected);
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
          
          {hasSearched && (
            <SearchResultsSummary properties={properties} loading={loading} />
          )}
          
          {hasSearched && !loading && properties.length > 0 && (
            <div className="space-y-4">
              <PropertySelector 
                properties={properties} 
                loading={loading}
                onExportSelected={handleExportSelected}
              />
              
              {selectedProperties.length > 0 && (
                <div className="fixed bottom-6 right-6">
                  <ExportDialog 
                    properties={selectedProperties}
                    trigger={
                      <Button size="lg" className="shadow-lg">
                        <FileText className="h-4 w-4 mr-2" />
                        Export {selectedProperties.length} Properties
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};