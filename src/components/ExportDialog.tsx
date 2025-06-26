import { useState } from 'react';
import { Property } from '@/types/RealEstate';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Loader2 } from 'lucide-react';
import { generatePDF } from '@/lib/exportUtils';

interface ExportDialogProps {
  properties: Property[];
  trigger: React.ReactNode;
}

export const ExportDialog = ({ properties, trigger }: ExportDialogProps) => {
  const [exportFormat, setExportFormat] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleExport = async () => {
    if (!exportFormat || properties.length === 0) return;
    
    setIsExporting(true);
    try {
      if (exportFormat === 'pdf') {
        await generatePDF(properties);
      }
      // Future: Add Word and Excel export here
      setOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Properties ({properties.length} selected)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Export Format
            </label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Choose format..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="word" disabled>Word Document (Coming Soon)</SelectItem>
                <SelectItem value="excel" disabled>Excel Spreadsheet (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              disabled={!exportFormat || isExporting || properties.length === 0}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};