import { Property } from '@/types/RealEstate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Calendar, Home, Building } from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
}

export const PropertyList = ({ properties, loading }: PropertyListProps) => {
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
    <div className="grid gap-4">
      {properties.map((property) => (
        <Card key={property.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
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
  );
};