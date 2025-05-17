
import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import CycleTracker from '@/components/CycleTracker';
import Calendar from '@/components/Calendar';
import SymptomLogger from '@/components/SymptomLogger';
import PhaseInfo from '@/components/PhaseInfo';
import PartnerTips from '@/components/PartnerTips';
import BottomNavbar from '@/components/BottomNavbar';
import { CycleData, SymptomEntry } from '@/types';
import { getCurrentPhase, getDaysUntilNextPeriod } from '@/utils/cycleUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'symptoms'>('home');
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

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
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
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <Calendar cycleData={cycleData} />
            <PhaseInfo 
              currentPhase={currentPhase}
              cycleData={cycleData}
            />
          </div>
        );
      case 'symptoms':
        return (
          <SymptomLogger 
            cycleData={cycleData} 
            onUpdateSymptoms={handleUpdateSymptoms}
          />
        );
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* App header */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="text-center">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CycleMate
          </h1>
          <p className="text-xs text-muted-foreground">
            Your supportive menstrual cycle companion
          </p>
        </div>
        
        {/* Mobile tab navigation */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2 bg-muted/50 rounded-full p-1">
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                activeTab === 'home' 
                ? 'bg-background text-primary shadow-sm' 
                : 'text-muted-foreground'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                activeTab === 'calendar' 
                ? 'bg-background text-primary shadow-sm' 
                : 'text-muted-foreground'
              }`}
            >
              Calendar
            </button>
            <button 
              onClick={() => setActiveTab('symptoms')}
              className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                activeTab === 'symptoms' 
                ? 'bg-background text-primary shadow-sm' 
                : 'text-muted-foreground'
              }`}
            >
              Log
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content with padding for the bottom navigation */}
      <main className="flex-1 px-4 pb-20 pt-4 max-w-lg mx-auto w-full">
        {renderContent()}
      </main>
      
      {/* Bottom navigation */}
      <BottomNavbar />
    </div>
  );
};

export default Index;
