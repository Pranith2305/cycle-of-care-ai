
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Settings, Lock, Bell, Moon, Sun, Heart, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BottomNavbar from '@/components/BottomNavbar';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { toast } = useToast();
  const [name, setName] = React.useState('Alex');
  const [partnerName, setPartnerName] = React.useState('Taylor');
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved."
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* App header */}
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="text-center">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display">
            Your Profile
          </h1>
        </div>
      </header>
      
      {/* Main content with padding for the bottom navigation */}
      <main className="flex-1 px-4 pb-20 pt-6 max-w-lg mx-auto w-full">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-xl">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
            <AvatarFallback className="text-lg">A</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-semibold font-display">{name}</h2>
          <p className="text-muted-foreground flex items-center gap-1 mt-1">
            <Heart size={16} className="text-primary" /> 
            Partner to {partnerName}
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Your name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Your name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="partnerName">Partner's name</Label>
                      <Input 
                        id="partnerName" 
                        value={partnerName} 
                        onChange={e => setPartnerName(e.target.value)} 
                        placeholder="Partner's name"
                      />
                    </div>
                    <Button type="submit">Save changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell size={18} /> Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="period-notify">Period reminders</Label>
                  <input type="checkbox" defaultChecked className="toggle" id="period-notify" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="tips-notify">Daily tips</Label>
                  <input type="checkbox" defaultChecked className="toggle" id="tips-notify" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="phase-notify">Phase changes</Label>
                  <input type="checkbox" defaultChecked className="toggle" id="phase-notify" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText size={18} /> Reports
                </CardTitle>
                <CardDescription>Customize your cycle reports</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-report">Weekly summary</Label>
                  <input type="checkbox" defaultChecked className="toggle" id="weekly-report" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="insights">Personalized insights</Label>
                  <input type="checkbox" defaultChecked className="toggle" id="insights" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings size={18} /> App settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun size={18} className="text-amber-500" />
                    <Label htmlFor="theme">Dark mode</Label>
                    <Moon size={18} className="text-indigo-400" />
                  </div>
                  <input type="checkbox" className="toggle" id="theme" />
                </div>
                
                <Button variant="outline" className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Privacy settings
                </Button>
                
                <Button variant="outline" className="w-full">
                  Export data
                </Button>
                
                <Button variant="outline" className="w-full text-destructive">
                  Delete account
                </Button>
              </CardContent>
            </Card>
            
            <p className="text-center text-xs text-muted-foreground mt-6">
              CycleMate v1.0.0 • Your supportive cycle companion
            </p>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Bottom navigation */}
      <BottomNavbar />
    </div>
  );
};

export default ProfilePage;
