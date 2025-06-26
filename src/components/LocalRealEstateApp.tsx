import { useState } from 'react';
import { SearchFiltersComponent } from './SearchFilters';
import { PropertyList } from './PropertyList';
import { useLocalRealEstateData } from '@/hooks/useLocalRealEstateData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Search, Database, Download, Trash2 } from 'lucide-react';

export const LocalRealEstateApp = () => {
  const { 
    properties, 
    loading, 
    searchProperties, 
    clearSearch, 
    populateAlleghenyData,
    clearAllData 
  } = useLocalRealEstateData();
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Allegheny County Real Estate Sales Data Search
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Property sales data stored locally in your browser - no database required!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Properties
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <SearchFiltersComponent 
              onSearch={searchProperties} 
              onClear={clearSearch} 
            />
            <PropertyList properties={properties} loading={loading} />
          </TabsContent>

          <TabsContent value="database">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Local Data Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Load property data and store it locally in your browser. 
                    No database or server required - all data is stored in localStorage.
                  </p>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-800">✓ Benefits of Local Storage:</h4>
                    <ul className="text-sm space-y-1 text-green-700">
                      <li>• No database setup required</li>
                      <li>• Works completely offline after initial data load</li>
                      <li>• Fast search and filtering</li>
                      <li>• Data persists between browser sessions</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={populateAlleghenyData}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {loading ? 'Loading Data...' : 'Load Data'}
                    </Button>
                    
                    <Button 
                      onClick={clearAllData}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All Data
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <p>Properties stored locally: {properties.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <PropertyList properties={properties} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};