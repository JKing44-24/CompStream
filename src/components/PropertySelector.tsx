import { useState } from 'react';
import { Property } from '@/types/RealEstate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Calendar, Home, Building, FileText } from 'lucide-react';

interface PropertySelectorProps {
  properties: Property[];
  loading: boolean;
  onExportSelected: (properties: Property[]) => void;
}

export const PropertySelector = ({ properties, loading, onExportSelected }: PropertySelectorProps) => {
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());

  const handlePropertyToggle = (propertyId: string, checked: boolean) => {
    const newSelected = new Set(selectedProperties);
    if (checked) {
      newSelected.add(propertyId);
    } else {
      newSelected.delete(propertyId);
    }
    setSelectedProperties(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProperties.size === properties.length) {
      setSelectedProperties(new Set());
    } else {
      setSelectedProperties(new Set(properties.map(p => p.id)));
    }
  };

  const handleExport = () => {
    const selected = properties.filter(p => selectedProperties.has(p.id));
    onExportSelected(selected);
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {properties.length > 0 && (
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleSelectAll}>
              {selectedProperties.size === properties.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-gray-600">
              {selectedProperties.size} of {properties.length} properties selected
            </span>
          </div>
          <Button 
            onClick={handleExport} 
            disabled={selectedProperties.size === 0}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export Selected
          </Button>
        </div>
      )}
      
      <div className="grid gap-4">
        {properties.map((property) => (
          <Card key={property.id} className={`hover:shadow-lg transition-shadow ${
            selectedProperties.has(property.id) ? 'ring-2 ring-blue-500' : ''
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedProperties.has(property.id)}
                    onCheckedChange={(checked) => 
                      handlePropertyToggle(property.id, checked as boolean)
                    }
                  />
                  <Home className="h-5 w-5" />
                  <span className="text-lg">{property.propertyaddress}</span>
                </div>
                <div className="flex gap-2">
                  {property.classdesc && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {property.classdesc}
                    </Badge>
                  )}
                  <Badge variant="secondary">${property.saleprice?.toLocaleString()}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{property.propertycity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{property.saledate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>Assessment: ${property.fairmarkettotal?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">School: </span>
                  <span>{property.schooldesc}</span>
                </div>
              </div>
              {property.usedesc && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Use: </span>{property.usedesc}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};