import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface MunicipalitySelectorProps {
  selectedMunicipality: string;
  onMunicipalityChange: (municipality: string) => void;
}

// Complete list of all Allegheny County municipalities
const ALLEGHENY_MUNICIPALITIES = [
  'Aleppo Township', 'Allegheny', 'Baldwin', 'Baldwin Township', 'Bell Acres',
  'Bellevue', 'Ben Avon', 'Ben Avon Heights', 'Bethel Park', 'Blawnox',
  'Brackenridge', 'Braddock', 'Braddock Hills', 'Bradford Woods',
  'Brentwood', 'Bridgeville', 'Carnegie', 'Castle Shannon', 'Cheswick',
  'Churchill', 'Clairton', 'Collier Township', 'Coraopolis', 'Crafton',
  'Crescent Township', 'Dormont', 'Dravosburg', 'Duquesne', 'East Allegheny',
  'East Deer Township', 'East McKeesport', 'East Pittsburgh', 'Edgewood',
  'Elizabeth', 'Elizabeth Township', 'Emsworth', 'Etna', 'Fawn Township',
  'Findlay Township', 'Forest Hills', 'Forward Township', 'Fox Chapel',
  'Franklin Park', 'Frazer Township', 'Gibsonia', 'Glassport', 'Glenfield',
  'Green Tree', 'Hampton Township', 'Harmar Township', 'Harrison Township',
  'Haysville', 'Heidelberg', 'Homestead', 'Indiana Township', 'Ingram',
  'Jefferson Hills', 'Kennedy Township', 'Kilbuck Township', 'Leet Township',
  'Leetsdale', 'Liberty', 'Lincoln', 'McCandless', 'McKeesport',
  'McKees Rocks', 'Marshall Township', 'Millvale', 'Monroeville',
  'Moon Township', 'Mount Lebanon', 'Mount Oliver', 'Munhall',
  'Neville Township', 'North Braddock', 'North Fayette Township',
  'North Versailles', 'Oakdale', 'Oakmont', 'OHara Township', 'Ohio Township',
  'Osborne', 'Penn Hills', 'Peters Township', 'Pine Township', 'Pittsburgh',
  'Pleasant Hills', 'Plum', 'Port Vue', 'Rankin', 'Reserve Township',
  'Richland Township', 'Robinson Township', 'Ross Township', 'Scott Township',
  'Sewickley', 'Sewickley Heights', 'Sewickley Hills', 'Shaler Township',
  'Sharpsburg', 'South Fayette Township', 'South Park Township',
  'South Versailles', 'Springdale', 'Springdale Township', 'Stowe Township',
  'Swissvale', 'Tarentum', 'Thornburg', 'Trafford', 'Upper St. Clair',
  'Verona', 'Versailles', 'Wall', 'West Deer Township', 'West Elizabeth',
  'West Homestead', 'West Mifflin', 'West View', 'Whitaker', 'White Oak',
  'Whitehall', 'Wilkinsburg', 'Wilkins Township'
];

export const MunicipalitySelector = ({ selectedMunicipality, onMunicipalityChange }: MunicipalitySelectorProps) => {
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('munidesc, propertycity')
          .not('munidesc', 'is', null)
          .order('munidesc');

        if (error) throw error;

        // Extract unique municipalities from database
        const dbMunicipalities = new Set<string>();
        
        data.forEach(item => {
          if (item.munidesc) {
            // Clean up municipality names
            let cleanName = item.munidesc;
            if (cleanName.includes('Ward') && cleanName.includes('Pittsburgh')) {
              cleanName = 'Pittsburgh';
            } else {
              const parts = cleanName.split(' - ');
              cleanName = parts[0].trim();
            }
            dbMunicipalities.add(cleanName);
          }
          
          if (item.propertycity) {
            dbMunicipalities.add(item.propertycity.trim());
          }
        });

        // Combine database municipalities with complete list
        const allMunicipalities = new Set([...Array.from(dbMunicipalities), ...ALLEGHENY_MUNICIPALITIES]);
        setMunicipalities(Array.from(allMunicipalities).sort());
      } catch (error) {
        console.error('Error fetching municipalities:', error);
        // Use complete fallback list
        setMunicipalities(ALLEGHENY_MUNICIPALITIES);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipalities();
  }, []);

  return (
    <Select value={selectedMunicipality} onValueChange={onMunicipalityChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Loading municipalities..." : "Select municipality"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Municipalities</SelectItem>
        {municipalities.map((municipality) => (
          <SelectItem key={municipality} value={municipality}>
            {municipality}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};