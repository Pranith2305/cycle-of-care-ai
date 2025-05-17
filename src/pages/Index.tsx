
import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import CycleTracker from '@/components/CycleTracker';
import PhaseInfo from '@/components/PhaseInfo';
import PartnerTips from '@/components/PartnerTips';
import BottomNavbar from '@/components/BottomNavbar';
import { CycleData, SymptomEntry } from '@/types';
import { getCurrentPhase, getDaysUntilNextPeriod } from '@/utils/cycleUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [cycleData, setCycleData] = useState<CycleData>({
    lastPeriodStartDate: subDays(new Date(), 14),
    averageCycleLength: 28,
    averagePeriodLength: 5,
    symptoms: {}
  });
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('cycleData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Convert date string back to Date object
        parsed.lastPeriodStartDate = new Date(parsed.lastPeriodStartDate);
        setCycleData(parsed);
      } catch (error) {
        console.error('Error loading cycle data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your saved data.",
          variant: "destructive",
        });
      }
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cycleData', JSON.stringify(cycleData));
  }, [cycleData]);
  
  const handleUpdateCycleData = (data: Partial<CycleData>) => {
    setCycleData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  const handleUpdateSymptoms = (date: string, symptoms: SymptomEntry) => {
    setCycleData(prev => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [date]: symptoms
      }
    }));
  };
  
  const currentPhase = getCurrentPhase(cycleData);
  const daysUntilNextPeriod = getDaysUntilNextPeriod(cycleData);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* App header */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="text-center">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display">
            CycleMate
          </h1>
          <p className="text-xs text-muted-foreground">
            Your supportive menstrual cycle companion
          </p>
        </div>
      </header>
      
      {/* Main content with padding for the bottom navigation */}
      <main className="flex-1 px-4 pb-20 pt-6 max-w-lg mx-auto w-full space-y-6">
        <CycleTracker 
          cycleData={cycleData} 
          onUpdateCycleData={handleUpdateCycleData} 
        />
        <PhaseInfo 
          currentPhase={currentPhase}
          cycleData={cycleData}
        />
        <PartnerTips 
          currentPhase={currentPhase} 
          daysUntilNextPeriod={daysUntilNextPeriod}
        />
      </main>
      
      {/* Bottom navigation */}
      <BottomNavbar />
    </div>
  );
};

export default Index;
