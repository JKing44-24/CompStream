import { useState } from 'react';
import { Property, SearchFilters } from '@/types/RealEstate';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export const useRealEstateData = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProperties = async (filters: SearchFilters) => {
    setLoading(true);
    console.log('Search filters received:', filters);
    
    try {
      let query = supabase
        .from('properties')
        .select('*');

      // Date filters
      if (filters.salesDateFrom) {
        query = query.gte('saledate', filters.salesDateFrom);
      }
      if (filters.salesDateTo) {
        query = query.lte('saledate', filters.salesDateTo);
      }
      
      // Price filters - handle numeric conversion safely
      if (filters.minPrice && filters.minPrice > 0) {
        query = query.filter('saleprice', 'not.is', null)
                    .gte('saleprice::numeric', filters.minPrice);
      }
      if (filters.maxPrice && filters.maxPrice > 0) {
        query = query.filter('saleprice', 'not.is', null)
                    .lte('saleprice::numeric', filters.maxPrice);
      }
      
      // Text filters - removed grantor/grantee as they don't exist in current schema
      
      // Acreage filters - lotarea conversion
      if (filters.minAcreage && filters.minAcreage > 0) {
        query = query.filter('lotarea', 'not.is', null)
                    .gte('lotarea::numeric', filters.minAcreage * 43560);
      }
      if (filters.maxAcreage && filters.maxAcreage > 0) {
        query = query.filter('lotarea', 'not.is', null)
                    .lte('lotarea::numeric', filters.maxAcreage * 43560);
      }
      
      // Municipality filter - only apply if specific municipalities selected
      if (filters.municipalities && filters.municipalities.length > 0 && !filters.municipalities.includes('All Municipalities')) {
        query = query.in('munidesc', filters.municipalities);
      }
      
      // Property type filter - only apply if specific types selected
      if (filters.propertyTypes && filters.propertyTypes.length > 0 && !filters.propertyTypes.includes('All Property Types')) {
        query = query.in('usedesc', filters.propertyTypes);
      }

      // Order by sale date descending and limit results for performance
      query = query.order('saledate', { ascending: false, nullsLast: true })
                  .limit(2000);

      console.log('Executing Supabase query...');
      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Query returned:', data?.length || 0, 'properties');

      const formattedData: Property[] = (data || []).map(item => ({
        id: item.parid || item.id,
        parid: item.parid,
        propertyaddress: item.propertyaddress,
        propertycity: item.propertycity,
        propertystate: item.propertystate,
        propertyzip: item.propertyzip,
        munidesc: item.munidesc?.trim(),
        schooldesc: item.schooldesc,
        saledate: item.saledate,
        saleprice: parseFloat(item.saleprice) || 0,
        lotarea: item.lotarea,
        finishedlivingarea: item.finishedlivingarea,
        fairmarkettotal: parseFloat(item.fairmarkettotal) || 0,
        yearblt: item.yearblt,
        bedrooms: item.bedrooms,
        fullbaths: item.fullbaths,
        changenoticeaddress1: item.changenoticeaddress1,
        classdesc: item.classdesc,
        usedesc: item.usedesc,
        grantor: '', // Not available in current schema
        grantee: ''  // Not available in current schema
      }));

      setProperties(formattedData);
      
      toast({
        title: 'Search Complete',
        description: `Found ${formattedData.length} properties matching your criteria`
      });
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to load properties from database. Please try again.',
        variant: 'destructive'
      });
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setProperties([]);
  };

  return {
    properties,
    loading,
    searchProperties,
    clearSearch
  };
};