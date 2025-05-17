
import React from 'react';
import { format } from 'date-fns';
import Calendar from '@/components/Calendar';
import PhaseInfo from '@/components/PhaseInfo';
import BottomNavbar from '@/components/BottomNavbar';
import { useToast } from '@/hooks/use-toast';
import { getCurrentPhase } from '@/utils/cycleUtils';

const CalendarPage = () => {
  const { toast } = useToast();
  const [cycleData, setCycleData] = React.useState(() => {
    const savedData = localStorage.getItem('cycleData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        parsed.lastPeriodStartDate = new Date(parsed.lastPeriodStartDate);
        return parsed;
      } catch (error) {
        console.error('Error loading cycle data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your saved data.",
          variant: "destructive",
        });
        return null;
      }
    }
    return null;
  });

  const currentPhase = cycleData ? getCurrentPhase(cycleData) : undefined;

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* App header */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="text-center">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display">
            CycleMate Calendar
          </h1>
          <p className="text-xs text-muted-foreground">
            {format(new Date(), "MMMM yyyy")}
          </p>
        </div>
      </header>
      
      {/* Main content with padding for the bottom navigation */}
      <main className="flex-1 px-4 pb-20 pt-6 max-w-lg mx-auto w-full space-y-6">
        {cycleData ? (
          <>
            <Calendar cycleData={cycleData} />
            <PhaseInfo 
              currentPhase={currentPhase}
              cycleData={cycleData}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 my-20 text-center">
            <div className="bg-muted/50 p-8 rounded-xl">
              <h2 className="text-xl font-semibold mb-2">No cycle data found</h2>
              <p className="text-muted-foreground">Please set up your cycle information on the home page.</p>
            </div>
          </div>
        )}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavbar />
    </div>
  );
};

export default CalendarPage;
