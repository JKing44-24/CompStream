import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MultiPropertyTypeSelectorProps {
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
}

export const MultiPropertyTypeSelector = ({ selectedTypes, onSelectionChange }: MultiPropertyTypeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('usedesc')
          .not('usedesc', 'is', null)
          .order('usedesc');

        if (error) throw error;

        const uniqueTypes = new Set<string>();
        
        data.forEach(item => {
          if (item.usedesc) {
            uniqueTypes.add(item.usedesc.trim());
          }
        });

        const sortedTypes = ['All Property Types', ...Array.from(uniqueTypes).sort()];
        setPropertyTypes(sortedTypes);
      } catch (error) {
        console.error('Error fetching property types:', error);
        setPropertyTypes(['All Property Types']);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, []);

  const handleTypeToggle = (type: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    if (type === 'All Property Types') {
      if (selectedTypes.includes('All Property Types')) {
        onSelectionChange([]);
      } else {
        onSelectionChange(['All Property Types']);
      }
    } else {
      let newSelection = selectedTypes.filter(t => t !== 'All Property Types');
      
      if (event.ctrlKey || event.metaKey) {
        if (newSelection.includes(type)) {
          onSelectionChange(newSelection.filter(t => t !== type));
        } else {
          onSelectionChange([...newSelection, type]);
        }
      } else {
        if (newSelection.includes(type) && newSelection.length === 1) {
          onSelectionChange([]);
        } else {
          onSelectionChange([type]);
        }
      }
    }
  };

  const removeType = (type: string) => {
    onSelectionChange(selectedTypes.filter(t => t !== type));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 mb-2">
        {selectedTypes.map(type => (
          <Badge key={type} variant="secondary" className="text-xs">
            {type}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => removeType(type)}
            />
          </Badge>
        ))}
      </div>
      
      <Card className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">
            {selectedTypes.length === 0 
              ? 'Select Property Types' 
              : selectedTypes.includes('All Property Types')
              ? 'All Property Types'
              : `${selectedTypes.length} type(s) selected`}
          </CardTitle>
        </CardHeader>
      </Card>
      
      {isOpen && (
        <Card>
          <CardContent className="p-2">
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {propertyTypes.map(type => (
                  <div 
                    key={type} 
                    className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={(e) => handleTypeToggle(type, e)}
                  >
                    <Checkbox 
                      checked={selectedTypes.includes(type)}
                      readOnly
                    />
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};