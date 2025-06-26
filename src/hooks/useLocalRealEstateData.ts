import { useState, useEffect } from 'react';
import { RealEstateRecord, SearchFilters } from '@/types/RealEstate';
import { toast } from '@/components/ui/use-toast';

export const useLocalRealEstateData = () => {
  const [properties, setProperties] = useState<RealEstateRecord[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<RealEstateRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('realEstateProperties');
      if (stored) {
        const data = JSON.parse(stored);
        setProperties(data);
        setFilteredProperties(data);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const saveToLocalStorage = (data: RealEstateRecord[]) => {
    try {
      localStorage.setItem('realEstateProperties', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const loadWPRDCData = async () => {
    try {
      setLoading(true);
      console.log('Loading data from WPRDC API...');
      
      let allProperties: RealEstateRecord[] = [];
      let offset = 0;
      const limit = 1000;
      let hasMore = true;
      
      while (hasMore) {
        try {
          const apiUrl = 'https://data.wprdc.org/api/3/action/datastore_search';
          const requestBody = {
            resource_id: '65855e14-549e-4992-b5be-d629afc676fa',
            limit: limit,
            offset: offset
          };
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!response.ok) {
            console.warn(`API request failed at offset ${offset}: ${response.status}`);
            break;
          }
          
          const data = await response.json();
          
          if (!data.success || !data.result?.records) {
            console.warn(`Invalid response at offset ${offset}`);
            break;
          }
          
          const records = data.result.records;
          console.log(`Processing batch: ${records.length} records at offset ${offset}`);
          
          if (records.length === 0) {
            hasMore = false;
            break;
          }
          
          const batchProperties: RealEstateRecord[] = records.map((record: any, index: number) => ({
            id: `wprdc-${offset}-${index}`,
            salesDate: record.SALEDATE || '',
            salesPrice: parseFloat(record.SALEPRICE) || 0,
            grantor: (record.GRANTOR || '').toString().substring(0, 255),
            grantee: (record.GRANTEE || '').toString().substring(0, 255),
            landSize: (record.LOTAREA || '').toString(),
            buildingSize: (record.FINISHEDLIVINGAREA || '').toString(),
            assessment: parseFloat(record.FAIRMARKETVALUE) || 0,
            propertyDescription: (record.PROPERTYDESC || '').toString().substring(0, 500),
            mapNumber: (record.PARID || '').toString(),
            municipality: (record.MUNICNAME || '').toString(),
            county: 'Allegheny',
            state: 'PA',
            schoolDistrict: (record.SCHOOLDESC || '').toString(),
            createdAt: new Date().toISOString()
          }));
          
          allProperties = [...allProperties, ...batchProperties];
          offset += limit;
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (batchError) {
          console.warn(`Error in batch at offset ${offset}:`, batchError);
          break;
        }
      }
      
      if (allProperties.length > 0) {
        // Remove duplicates by mapNumber
        const uniqueProperties = allProperties.filter((property, index, self) => 
          index === self.findIndex(p => p.mapNumber === property.mapNumber)
        );
        
        setProperties(uniqueProperties);
        setFilteredProperties(uniqueProperties);
        saveToLocalStorage(uniqueProperties);
        
        toast({
          title: 'Success',
          description: `Successfully loaded ${uniqueProperties.length} properties from WPRDC`
        });
      } else {
        throw new Error('No data retrieved from API');
      }
      
    } catch (error) {
      console.error('Error loading WPRDC data:', error);
      toast({
        title: 'Error',
        description: `Failed to load data: ${error instanceof Error ? error.message : 'Network error'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const searchProperties = (filters: SearchFilters) => {
    let filtered = [...properties];

    if (filters.salesDateFrom) {
      filtered = filtered.filter(p => p.salesDate >= filters.salesDateFrom!);
    }
    if (filters.salesDateTo) {
      filtered = filtered.filter(p => p.salesDate <= filters.salesDateTo!);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.salesPrice >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.salesPrice <= filters.maxPrice!);
    }
    if (filters.municipality) {
      filtered = filtered.filter(p => 
        p.municipality.toLowerCase().includes(filters.municipality!.toLowerCase())
      );
    }
    if (filters.county) {
      filtered = filtered.filter(p => 
        p.county.toLowerCase().includes(filters.county!.toLowerCase())
      );
    }
    if (filters.grantor) {
      filtered = filtered.filter(p => 
        p.grantor.toLowerCase().includes(filters.grantor!.toLowerCase())
      );
    }
    if (filters.grantee) {
      filtered = filtered.filter(p => 
        p.grantee.toLowerCase().includes(filters.grantee!.toLowerCase())
      );
    }
    if (filters.schoolDistrict) {
      filtered = filtered.filter(p => 
        p.schoolDistrict && p.schoolDistrict.toLowerCase().includes(filters.schoolDistrict!.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  const clearSearch = () => {
    setFilteredProperties(properties);
  };

  const clearAllData = () => {
    setProperties([]);
    setFilteredProperties([]);
    localStorage.removeItem('realEstateProperties');
    toast({
      title: 'Data Cleared',
      description: 'All property data has been cleared from local storage'
    });
  };

  return {
    properties: filteredProperties,
    loading,
    searchProperties,
    clearSearch,
    populateAlleghenyData: loadWPRDCData,
    refreshData: loadFromLocalStorage,
    clearAllData
  };
};