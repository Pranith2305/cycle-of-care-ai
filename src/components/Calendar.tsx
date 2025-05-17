
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { predictPhase, formatDateToString } from '@/utils/cycleUtils';
import { CycleData, SymptomEntry } from '@/types';

interface CalendarProps {
  cycleData: CycleData;
}

const Calendar: React.FC<CalendarProps> = ({ cycleData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Get days for the current month view
  const getDaysForMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = monthStart;
    const endDate = monthEnd;
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Calculate offset for the first day of the month
    const startDay = getDay(startDate);
    const prefixDays = Array(startDay).fill(null);
    
    return [...prefixDays, ...days];
  };
  
  const days = getDaysForMonth();
  
  const getPhaseColorClass = (date: Date) => {
    if (!cycleData.lastPeriodStartDate) return '';
    
    const phase = predictPhase(date, cycleData);
    switch (phase) {
      case 'menstrual': return 'phase-menstrual';
      case 'follicular': return 'phase-follicular';
      case 'ovulation': return 'phase-ovulation';
      case 'luteal': return 'phase-luteal';
      default: return '';
    }
  };
  
  const hasSymptoms = (date: Date): boolean => {
    const dateString = formatDateToString(date);
    return !!cycleData.symptoms[dateString];
  };
  
  const getSelectedDateSymptoms = (): SymptomEntry | null => {
    if (!selectedDate) return null;
    
    const dateString = formatDateToString(selectedDate);
    return cycleData.symptoms[dateString] || null;
  };
  
  const getSymptomSummary = (symptoms: SymptomEntry) => {
    const summary = [];
    
    if (symptoms.mood) summary.push(`Mood: ${symptoms.mood}`);
    if (symptoms.energy) summary.push(`Energy: ${symptoms.energy}`);
    if (symptoms.cramps && symptoms.cramps !== 'none') summary.push(`Cramps: ${symptoms.cramps}`);
    if (symptoms.headache && symptoms.headache !== 'none') summary.push(`Headache: ${symptoms.headache}`);
    if (symptoms.flow && symptoms.flow !== 'none') summary.push(`Flow: ${symptoms.flow}`);
    
    return summary.length > 0 ? summary.join(', ') : 'No symptoms recorded';
  };
  
  const selectedSymptoms = getSelectedDateSymptoms();
  const phase = selectedDate ? predictPhase(selectedDate, cycleData) : undefined;
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-primary">Calendar</CardTitle>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              ←
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              →
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <h3 className="text-xl font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-sm font-medium py-1">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="p-2"></div>;
            }
            
            const dayNumber = format(day, 'd');
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const dayHasSymptoms = hasSymptoms(day);
            
            return (
              <Button
                key={day.toISOString()}
                variant="ghost"
                className={cn(
                  'h-10 w-full rounded-md p-0 font-normal',
                  !isCurrentMonth && 'text-muted-foreground opacity-50',
                  isToday(day) && 'border border-primary',
                  isCurrentMonth && getPhaseColorClass(day),
                  selectedDate && isSameDay(day, selectedDate) && 'ring-2 ring-primary'
                )}
                onClick={() => setSelectedDate(day)}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>
                  {dayNumber}
                </time>
                {dayHasSymptoms && (
                  <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                )}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-2 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-menstrual"></div>
              <span>Menstrual</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-follicular"></div>
              <span>Follicular</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-ovulation"></div>
              <span>Ovulation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-luteal"></div>
              <span>Luteal</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
              {phase && <span className="ml-2 opacity-70">({phase})</span>}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSymptoms ? (
            <div className="space-y-3 py-4">
              {selectedSymptoms.mood && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Mood:</span>
                  <span>{selectedSymptoms.mood}</span>
                </div>
              )}
              
              {selectedSymptoms.energy && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Energy:</span>
                  <span>{selectedSymptoms.energy}</span>
                </div>
              )}
              
              {selectedSymptoms.cramps && selectedSymptoms.cramps !== 'none' && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cramps:</span>
                  <span>{selectedSymptoms.cramps}</span>
                </div>
              )}
              
              {selectedSymptoms.headache && selectedSymptoms.headache !== 'none' && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Headache:</span>
                  <span>{selectedSymptoms.headache}</span>
                </div>
              )}
              
              {selectedSymptoms.bloating && selectedSymptoms.bloating !== 'none' && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Bloating:</span>
                  <span>{selectedSymptoms.bloating}</span>
                </div>
              )}
              
              {selectedSymptoms.flow && selectedSymptoms.flow !== 'none' && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Flow:</span>
                  <span>{selectedSymptoms.flow}</span>
                </div>
              )}
              
              {selectedSymptoms.notes && (
                <div className="pt-2 border-t">
                  <p className="font-medium mb-1">Notes:</p>
                  <p className="text-muted-foreground">{selectedSymptoms.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No symptoms recorded for this day
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Calendar;
