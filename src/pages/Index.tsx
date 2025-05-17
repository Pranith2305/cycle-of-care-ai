
import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import CycleTracker from '@/components/CycleTracker';
import Calendar from '@/components/Calendar';
import SymptomLogger from '@/components/SymptomLogger';
import PhaseInfo from '@/components/PhaseInfo';
import PartnerTips from '@/components/PartnerTips';
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="font-bold text-4xl md:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse-gentle">
          CycleMate
        </h1>
        <p className="text-muted-foreground mt-2">
          Your supportive menstrual cycle companion
        </p>
      </header>
      
      <main className="max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <CycleTracker 
              cycleData={cycleData} 
              onUpdateCycleData={handleUpdateCycleData} 
            />
            <PartnerTips 
              currentPhase={currentPhase} 
              daysUntilNextPeriod={daysUntilNextPeriod}
            />
          </div>
          
          <div className="md:col-span-1 space-y-6">
            <Calendar cycleData={cycleData} />
            <PhaseInfo 
              currentPhase={currentPhase}
              cycleData={cycleData}
            />
          </div>
          
          <div className="md:col-span-2 lg:col-span-1">
            <SymptomLogger 
              cycleData={cycleData} 
              onUpdateSymptoms={handleUpdateSymptoms}
            />
          </div>
        </div>
      </main>
      
      <footer className="max-w-7xl mx-auto mt-8 text-center text-sm text-muted-foreground">
        <p>CycleMate - Supporting relationships through cycle awareness</p>
      </footer>
    </div>
  );
};

export default Index;
