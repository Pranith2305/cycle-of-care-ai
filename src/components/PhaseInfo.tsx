
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCyclePhaseInfo } from '@/utils/cycleUtils';
import { cn } from '@/lib/utils';
import { CycleData, CyclePhase } from '@/types';

interface PhaseInfoProps {
  currentPhase?: CyclePhase;
  cycleData: CycleData;
}

const PhaseInfo: React.FC<PhaseInfoProps> = ({ currentPhase, cycleData }) => {
  const phaseInfo = getCyclePhaseInfo(cycleData.averageCycleLength);
  
  // Find the current phase info object
  const currentPhaseInfo = phaseInfo.find(p => p.phase === currentPhase);
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-primary">Cycle Phases</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPhaseInfo ? (
          <div className="border-l-4 pl-3 border-primary bg-primary/5 p-2 rounded-r-md">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>{currentPhaseInfo.emoji}</span>
              <span>Current: {currentPhaseInfo.title}</span>
            </h3>
            <p className="text-muted-foreground">{currentPhaseInfo.description}</p>
            <p className="mt-2 font-medium">{currentPhaseInfo.tipText}</p>
          </div>
        ) : (
          <p className="text-muted-foreground italic text-center">Set your cycle data to see your current phase</p>
        )}
        
        <div className="grid gap-2">
          {phaseInfo.map((phase) => (
            <div 
              key={phase.phase}
              className={cn(
                "p-3 rounded-md border",
                currentPhase === phase.phase ? "border-primary" : "border-border",
                `bg-${phase.phase}/20`
              )}
            >
              <h4 className="flex items-center gap-2 font-medium">
                <span>{phase.emoji}</span>
                <span>{phase.title}</span>
                <span className="text-sm text-muted-foreground ml-auto">{phase.daysRange}</span>
              </h4>
              <p className="text-sm mt-1 text-muted-foreground">{phase.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhaseInfo;
