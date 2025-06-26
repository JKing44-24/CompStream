import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/RealEstate';
import { CalendarDays, DollarSign, MapPin, Home, GraduationCap, Building, User } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const calculateAcreage = (lotArea: string) => {
    const sqFt = parseFloat(lotArea);
    if (isNaN(sqFt) || sqFt <= 0) return null;
    const acres = sqFt / 43560;
    return acres >= 0.1 ? `${acres.toFixed(2)} acres` : `${sqFt} sq ft`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {property.propertyaddress}
          </CardTitle>
          {property.classdesc && (
            <Badge variant="secondary" className="ml-2">
              <Building className="h-3 w-3 mr-1" />
              {property.classdesc}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-green-600">
          <DollarSign className="h-4 w-4" />
          <span className="font-bold text-lg">{formatPrice(property.saleprice)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(property.saledate)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{property.propertycity}, {property.propertystate} {property.propertyzip}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Home className="h-4 w-4" />
          <span>{property.finishedlivingarea} sq ft | {calculateAcreage(property.lotarea) || property.lotarea}</span>
        </div>
        
        {property.schooldesc && (
          <div className="flex items-center gap-2 text-blue-600">
            <GraduationCap className="h-4 w-4" />
            <span>{property.schooldesc}</span>
          </div>
        )}
        
        {(property.grantor || property.grantee) && (
          <div className="text-sm text-gray-600 space-y-1">
            {property.grantor && (
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>From: {property.grantor}</span>
              </div>
            )}
            {property.grantee && (
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>To: {property.grantee}</span>
              </div>
            )}
          </div>
        )}
        
        {property.usedesc && (
          <div className="text-sm text-gray-500 pt-2 border-t">
            <div>Use: {property.usedesc}</div>
            <div>Municipality: {property.munidesc}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};