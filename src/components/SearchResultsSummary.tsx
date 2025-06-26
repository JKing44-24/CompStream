import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/RealEstate';
import { BarChart3, DollarSign, Home, MapPin } from 'lucide-react';

interface SearchResultsSummaryProps {
  properties: Property[];
  loading: boolean;
}

export const SearchResultsSummary = ({ properties, loading }: SearchResultsSummaryProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No properties found. Try adjusting your search criteria.</p>
        </CardContent>
      </Card>
    );
  }

  const totalProperties = properties.length;
  const avgPrice = properties.reduce((sum, p) => sum + (p.saleprice || 0), 0) / totalProperties;
  const minPrice = Math.min(...properties.map(p => p.saleprice || 0).filter(p => p > 0));
  const maxPrice = Math.max(...properties.map(p => p.saleprice || 0));
  const cities = [...new Set(properties.map(p => p.propertycity).filter(Boolean))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Total Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProperties.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Average Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${avgPrice.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <div>${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Cities Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {cities.slice(0, 3).map(city => (
              <Badge key={city} variant="secondary" className="text-xs">{city}</Badge>
            ))}
            {cities.length > 3 && (
              <Badge variant="outline" className="text-xs">+{cities.length - 3} more</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};