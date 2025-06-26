import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface MultiMunicipalitySelectorProps {
  selectedMunicipalities: string[];
  onSelectionChange: (municipalities: string[]) => void;
}

export const MultiMunicipalitySelector = ({ selectedMunicipalities, onSelectionChange }: MultiMunicipalitySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('munidesc')
          .not('munidesc', 'is', null)
          .order('munidesc');

        if (error) throw error;

        const uniqueMunicipalities = new Set<string>();
        
        data.forEach(item => {
          if (item.munidesc) {
            const cleanName = item.munidesc.trim();
            uniqueMunicipalities.add(cleanName);
          }
        });

        const sortedMunicipalities = ['All Municipalities', ...Array.from(uniqueMunicipalities).sort()];
        setMunicipalities(sortedMunicipalities);
      } catch (error) {
        console.error('Error fetching municipalities:', error);
        setMunicipalities(['All Municipalities']);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipalities();
  }, []);

  const handleSelect = (municipality: string) => {
    if (municipality === 'All Municipalities') {
      if (selectedMunicipalities.includes('All Municipalities')) {
        onSelectionChange([]);
      } else {
        onSelectionChange(['All Municipalities']);
      }
    } else {
      let newSelection = selectedMunicipalities.filter(m => m !== 'All Municipalities');
      if (newSelection.includes(municipality)) {
        onSelectionChange(newSelection.filter(m => m !== municipality));
      } else {
        onSelectionChange([...newSelection, municipality]);
      }
    }
  };

  const removeMunicipality = (municipality: string) => {
    onSelectionChange(selectedMunicipalities.filter(m => m !== municipality));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedMunicipalities.length === 0
              ? "Select municipalities..."
              : selectedMunicipalities.includes('All Municipalities')
              ? "All Municipalities"
              : `${selectedMunicipalities.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search municipalities..." />
            <CommandEmpty>No municipality found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {municipalities.map((municipality) => (
                <CommandItem
                  key={municipality}
                  value={municipality}
                  onSelect={() => handleSelect(municipality)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedMunicipalities.includes(municipality) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {municipality}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedMunicipalities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedMunicipalities.map((municipality) => (
            <Badge key={municipality} variant="secondary" className="text-xs">
              {municipality}
              <button
                className="ml-1 hover:text-red-500"
                onClick={() => removeMunicipality(municipality)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};