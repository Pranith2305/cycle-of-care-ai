
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { getCurrentCycleDay, getNextPeriodDate, getDaysUntilNextPeriod, getCurrentPhase } from '@/utils/cycleUtils';
import { CycleData } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CycleTrackerProps {
  cycleData: CycleData;
  onUpdateCycleData: (data: Partial<CycleData>) => void;
}

const CycleTracker: React.FC<CycleTrackerProps> = ({ cycleData, onUpdateCycleData }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(cycleData.lastPeriodStartDate);

  const handleSave = () => {
    if (date) {
      onUpdateCycleData({ 
        lastPeriodStartDate: date 
      });
      toast({
        title: "Cycle data updated",
        description: "Your cycle information has been saved.",
      });
    }
  };

  const currentDay = cycleData.lastPeriodStartDate ? getCurrentCycleDay(cycleData.lastPeriodStartDate) : 0;
  const nextPeriod = cycleData.lastPeriodStartDate ? getNextPeriodDate(cycleData) : new Date();
  const daysUntil = cycleData.lastPeriodStartDate ? getDaysUntilNextPeriod(cycleData) : 0;
  const currentPhase = cycleData.lastPeriodStartDate ? getCurrentPhase(cycleData) : undefined;

  const getPhaseEmoji = (phase: string | undefined) => {
    switch (phase) {
      case 'menstrual': return '🟥';
      case 'follicular': return '🌱';
      case 'ovulation': return '🧡';
      case 'luteal': return '🌕';
      default: return '⭕';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Cycle Tracker</CardTitle>
        <CardDescription>Track and predict menstrual cycles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="last-period">Last Period Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2 items-center">
          <div className="w-1/2 space-y-2">
            <Label htmlFor="cycle-length">Cycle Length</Label>
            <Input
              id="cycle-length"
              type="number"
              value={cycleData.averageCycleLength}
              min={20}
              max={40}
              onChange={(e) => onUpdateCycleData({ averageCycleLength: parseInt(e.target.value) })}
            />
          </div>
          <div className="w-1/2 space-y-2">
            <Label htmlFor="period-length">Period Length</Label>
            <Input
              id="period-length"
              type="number"
              value={cycleData.averagePeriodLength}
              min={2}
              max={10}
              onChange={(e) => onUpdateCycleData({ averagePeriodLength: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <Button className="w-full" onClick={handleSave}>Save Cycle Info</Button>

        {cycleData.lastPeriodStartDate && (
          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-center bg-secondary/20 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium">Current Cycle Day</p>
                <p className="text-2xl font-bold">{currentDay}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Current Phase</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {getPhaseEmoji(currentPhase)}
                  {currentPhase ? currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1) : 'Unknown'}
                </p>
              </div>
            </div>
            
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm font-medium">Next Period Prediction</p>
              <p className="text-lg font-semibold">{format(nextPeriod, 'MMMM d, yyyy')}</p>
              <p className="text-sm text-muted-foreground">
                {daysUntil <= 0 
                  ? "Your period is due today!" 
                  : `${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} away`}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CycleTracker;
