
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CycleData, SymptomEntry, SymptomLevel } from '@/types';
import { formatDateToString } from '@/utils/cycleUtils';
import { useToast } from '@/hooks/use-toast';

interface SymptomLoggerProps {
  cycleData: CycleData;
  onUpdateSymptoms: (date: string, symptoms: SymptomEntry) => void;
}

const SymptomLogger: React.FC<SymptomLoggerProps> = ({ cycleData, onUpdateSymptoms }) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateString = formatDateToString(selectedDate);
  
  // Get existing symptoms for the selected date
  const existingSymptoms = cycleData.symptoms[dateString] || {};
  
  // State for current symptoms being edited
  const [symptoms, setSymptoms] = useState<SymptomEntry>(existingSymptoms);
  
  const handleSymptomChange = (key: keyof SymptomEntry, value: any) => {
    setSymptoms(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    onUpdateSymptoms(dateString, symptoms);
    toast({
      title: "Symptoms logged",
      description: `Symptoms for ${format(selectedDate, 'MMMM d, yyyy')} have been saved.`,
    });
  };
  
  const getSliderValue = (level?: SymptomLevel): number[] => {
    switch (level) {
      case 'none': return [0];
      case 'mild': return [33];
      case 'moderate': return [66];
      case 'severe': return [100];
      default: return [0];
    }
  };
  
  const getSymptomLevelFromSlider = (value: number): SymptomLevel => {
    if (value <= 0) return 'none';
    if (value <= 33) return 'mild';
    if (value <= 66) return 'moderate';
    return 'severe';
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const newDateString = formatDateToString(date);
      const existingSymptoms = cycleData.symptoms[newDateString] || {};
      setSymptoms(existingSymptoms);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Symptom Logger</CardTitle>
        <CardDescription>Track how you're feeling during your cycle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Mood</Label>
          <Select
            value={symptoms.mood || ''}
            onValueChange={(value) => handleSymptomChange('mood', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How are you feeling?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Not specified</SelectItem>
              <SelectItem value="happy">Happy 😊</SelectItem>
              <SelectItem value="calm">Calm 😌</SelectItem>
              <SelectItem value="irritable">Irritable 😤</SelectItem>
              <SelectItem value="sad">Sad 😢</SelectItem>
              <SelectItem value="anxious">Anxious 😰</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Energy Level</Label>
          <Select 
            value={symptoms.energy || ''}
            onValueChange={(value) => handleSymptomChange('energy', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How's your energy today?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Not specified</SelectItem>
              <SelectItem value="high">High ⚡</SelectItem>
              <SelectItem value="normal">Normal ✨</SelectItem>
              <SelectItem value="low">Low 🔋</SelectItem>
              <SelectItem value="exhausted">Exhausted 😴</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Cramps</Label>
              <span className="text-sm text-muted-foreground">
                {symptoms.cramps || 'None'}
              </span>
            </div>
            <Slider 
              value={getSliderValue(symptoms.cramps)}
              onValueChange={(value) => handleSymptomChange('cramps', getSymptomLevelFromSlider(value[0]))}
              max={100} 
              step={1}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Headache</Label>
              <span className="text-sm text-muted-foreground">
                {symptoms.headache || 'None'}
              </span>
            </div>
            <Slider
              value={getSliderValue(symptoms.headache)}
              onValueChange={(value) => handleSymptomChange('headache', getSymptomLevelFromSlider(value[0]))}
              max={100}
              step={1}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Bloating</Label>
              <span className="text-sm text-muted-foreground">
                {symptoms.bloating || 'None'}
              </span>
            </div>
            <Slider 
              value={getSliderValue(symptoms.bloating)}
              onValueChange={(value) => handleSymptomChange('bloating', getSymptomLevelFromSlider(value[0]))}
              max={100}
              step={1}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Flow</Label>
          <Select 
            value={symptoms.flow || ''}
            onValueChange={(value) => handleSymptomChange('flow', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select flow intensity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Not specified</SelectItem>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="spotting">Spotting</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea 
            placeholder="Any additional details..."
            value={symptoms.notes || ''}
            onChange={(e) => handleSymptomChange('notes', e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={handleSave}>Save Symptoms</Button>
      </CardContent>
    </Card>
  );
};

export default SymptomLogger;
