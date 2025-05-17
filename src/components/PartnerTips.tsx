
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getPartnerTips } from '@/utils/cycleUtils';
import { CyclePhase } from '@/types';
import { Heart } from 'lucide-react';

interface PartnerTipsProps {
  currentPhase?: CyclePhase;
  daysUntilNextPeriod: number;
}

const PartnerTips: React.FC<PartnerTipsProps> = ({ currentPhase, daysUntilNextPeriod }) => {
  if (!currentPhase) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Partner Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center italic">Enter cycle data to see personalized partner tips</p>
        </CardContent>
      </Card>
    );
  }

  const phaseTip = getPartnerTips(currentPhase);
  
  const getPeriodAlert = () => {
    if (daysUntilNextPeriod <= 3 && daysUntilNextPeriod > 0) {
      return (
        <Alert className="mt-4 bg-primary/10 border-primary">
          <Heart className="h-4 w-4" />
          <AlertTitle>Period Coming Soon</AlertTitle>
          <AlertDescription>
            The next period is predicted to start in {daysUntilNextPeriod} {daysUntilNextPeriod === 1 ? 'day' : 'days'}. Consider preparing a small care package with chocolates, tea, or a heating pad.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };
  
  const getPhaseSpecificTips = () => {
    switch (currentPhase) {
      case 'menstrual':
        return (
          <div className="space-y-2">
            <p className="font-medium">Things that may help:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Warm drinks like herbal tea</li>
              <li>Heating pads for cramps</li>
              <li>Dark chocolate (70%+ cocoa)</li>
              <li>Gentle massages</li>
              <li>Understanding and patience</li>
            </ul>
          </div>
        );
      case 'ovulation':
        return (
          <div className="space-y-2">
            <p className="font-medium">Things to consider:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Energy levels are typically higher</li>
              <li>Libido may be elevated</li>
              <li>Great time for date nights</li>
              <li>She may be more receptive to physical intimacy</li>
              <li>Social activities are typically more enjoyable</li>
            </ul>
          </div>
        );
      case 'luteal':
        return (
          <div className="space-y-2">
            <p className="font-medium">Support during PMS:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Mood swings may occur - be patient</li>
              <li>Comfort foods may be appreciated</li>
              <li>Offer reassurance and understanding</li>
              <li>Create a calm environment</li>
              <li>Simple acts of kindness go a long way</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Partner Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-secondary/10">
          <AlertTitle className="font-medium">{currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase Tips</AlertTitle>
          <AlertDescription>{phaseTip}</AlertDescription>
        </Alert>
        
        {getPhaseSpecificTips()}
        {getPeriodAlert()}
      </CardContent>
    </Card>
  );
};

export default PartnerTips;
