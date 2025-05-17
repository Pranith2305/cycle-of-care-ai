
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Gift, Coffee, MessageCircle, Sparkles } from 'lucide-react';
import BottomNavbar from '@/components/BottomNavbar';
import { useToast } from '@/hooks/use-toast';
import { getCurrentPhase, getDaysUntilNextPeriod } from '@/utils/cycleUtils';

const TipsPage = () => {
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
        return null;
      }
    }
    return null;
  });

  const currentPhase = cycleData ? getCurrentPhase(cycleData) : undefined;
  const daysUntilNextPeriod = cycleData ? getDaysUntilNextPeriod(cycleData) : undefined;
  
  const handleSaveTip = (tip: string) => {
    toast({
      title: "Tip saved",
      description: "This tip has been added to your favorites.",
    });
  };

  const generalTips = [
    {
      title: "Communication Is Key",
      description: "Ask her directly how she's feeling and what she needs. Sometimes just listening without trying to 'fix' problems is the best approach.",
      icon: MessageCircle,
      color: "text-pink-500",
    },
    {
      title: "Self-Care Reminder",
      description: "Encourage her to take time for herself. Sometimes a relaxing bath or quiet time alone can make a big difference.",
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Be Patient",
      description: "Hormonal fluctuations can affect mood. A little extra patience goes a long way during challenging cycle days.",
      icon: Coffee,
      color: "text-amber-600",
    },
    {
      title: "Small Gestures Matter",
      description: "Sometimes the smallest acts of kindness have the biggest impact - a cup of tea, a note, or taking over a chore.",
      icon: Gift,
      color: "text-violet-500",
    }
  ];
  
  const renderPhaseSpecificTips = () => {
    if (!currentPhase) return null;
    
    const phaseTips = {
      menstrual: [
        "Offer a heating pad for cramps",
        "Bring her favorite comfort food",
        "Give her space if she needs rest",
        "Help with daily responsibilities"
      ],
      follicular: [
        "Great time for new activities together",
        "She may have more energy - plan something fun",
        "Engage in creative projects together",
        "Support her new ideas and initiatives"
      ],
      ovulation: [
        "Plan a special date night",
        "She might be feeling more confident",
        "Energy levels are typically high",
        "Great time for meaningful conversations"
      ],
      luteal: [
        "Be understanding of mood changes",
        "Chocolate or sweet treats are appreciated",
        "Help create a calm environment",
        "Extra affirmation and reassurance helps"
      ]
    };
    
    const phaseColors = {
      menstrual: "border-menstrual bg-menstrual/10",
      follicular: "border-follicular bg-follicular/10",
      ovulation: "border-ovulation bg-ovulation/10",
      luteal: "border-luteal bg-luteal/10",
    };
    
    return (
      <Card className={`shadow-md border-l-4 ${phaseColors[currentPhase]}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Phase-Specific Tips</span>
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {currentPhase === 'luteal' && daysUntilNextPeriod && daysUntilNextPeriod <= 5 ? 
                `${daysUntilNextPeriod} days until next period` : ''}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {phaseTips[currentPhase].map((tip, index) => (
              <li key={index} className="flex items-start gap-2 p-2 rounded-md bg-background">
                <Star className="h-4 w-4 text-primary mt-1 shrink-0" />
                <span className="text-sm">{tip}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto p-1 h-auto" 
                  onClick={() => handleSaveTip(tip)}
                >
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* App header */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="text-center">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display">
            Partner Tips
          </h1>
          <p className="text-xs text-muted-foreground">
            Thoughtful ways to support her
          </p>
        </div>
      </header>
      
      {/* Main content with padding for the bottom navigation */}
      <main className="flex-1 px-4 pb-20 pt-6 max-w-lg mx-auto w-full space-y-6">
        {renderPhaseSpecificTips()}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>General Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generalTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-card">
                <div className={`p-2 rounded-full bg-primary/10 ${tip.color}`}>
                  <tip.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="shrink-0" 
                  onClick={() => handleSaveTip(tip.title)}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
      
      {/* Bottom navigation */}
      <BottomNavbar />
    </div>
  );
};

export default TipsPage;
