import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SearchFilters } from '@/types/RealEstate';
import { MultiMunicipalitySelector } from '@/components/MultiMunicipalitySelector';
import { MultiPropertyTypeSelector } from '@/components/MultiPropertyTypeSelector';
import { Search, X } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

export const SearchFiltersComponent = ({ onSearch, onClear }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    salesDateFrom: '2020-01-01',
    salesDateTo: '2025-12-31',
    municipalities: ['All Municipalities'],
    propertyTypes: ['All Property Types']
  });

  const handleInputChange = (field: keyof SearchFilters, value: string | number | string[]) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const handleMunicipalitiesChange = (municipalities: string[]) => {
    setFilters(prev => ({
      ...prev,
      municipalities
    }));
  };

  const handlePropertyTypesChange = (propertyTypes: string[]) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes
    }));
  };

  const handleSearch = () => {
    console.log('Searching Allegheny County with filters:', filters);
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      salesDateFrom: '2020-01-01',
      salesDateTo: '2025-12-31',
      municipalities: ['All Municipalities'],
      propertyTypes: ['All Property Types']
    });
    onClear();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Allegheny County Properties
        </CardTitle>
        <p className="text-sm text-gray-600">Hold Ctrl/Cmd while clicking to select multiple municipalities or property types</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="municipalities">Municipalities</Label>
            <MultiMunicipalitySelector
              selectedMunicipalities={filters.municipalities || []}
              onSelectionChange={handleMunicipalitiesChange}
            />
          </div>
          <div>
            <Label htmlFor="propertyTypes">Property Types</Label>
            <MultiPropertyTypeSelector
              selectedTypes={filters.propertyTypes || []}
              onSelectionChange={handlePropertyTypesChange}
            />
          </div>
          <div>
            <Label htmlFor="grantor">Grantor</Label>
            <Input
              id="grantor"
              type="text"
              placeholder="Enter grantor name"
              value={filters.grantor || ''}
              onChange={(e) => handleInputChange('grantor', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="grantee">Grantee</Label>
            <Input
              id="grantee"
              type="text"
              placeholder="Enter grantee name"
              value={filters.grantee || ''}
              onChange={(e) => handleInputChange('grantee', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="minAcreage">Min Acreage</Label>
            <Input
              id="minAcreage"
              type="number"
              step="0.1"
              placeholder="0"
              value={filters.minAcreage || ''}
              onChange={(e) => handleInputChange('minAcreage', Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="maxAcreage">Max Acreage</Label>
            <Input
              id="maxAcreage"
              type="number"
              step="0.1"
              placeholder="999"
              value={filters.maxAcreage || ''}
              onChange={(e) => handleInputChange('maxAcreage', Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="salesDateFrom">Sale Date From</Label>
            <Input
              id="salesDateFrom"
              type="date"
              value={filters.salesDateFrom || ''}
              onChange={(e) => handleInputChange('salesDateFrom', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="salesDateTo">Sale Date To</Label>
            <Input
              id="salesDateTo"
              type="date"
              value={filters.salesDateTo || ''}
              onChange={(e) => handleInputChange('salesDateTo', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="minPrice">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="$0"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="$999,999,999"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button variant="outline" onClick={handleClear} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};