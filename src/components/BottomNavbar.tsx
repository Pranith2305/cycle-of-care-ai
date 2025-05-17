
import React from 'react';
import { Calendar, Home, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const BottomNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Heart, label: 'Tips', path: '/tips' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-2 flex justify-around items-center z-50 shadow-lg">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <Link 
            key={item.path}
            to={item.path} 
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-all",
              isActive 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary/80"
            )}
          >
            <item.icon size={22} className={cn(
              "transition-all duration-200",
              isActive ? "text-primary animate-pulse-gentle" : ""
            )} />
            <span className={cn(
              "text-xs mt-1 font-medium",
              isActive ? "text-primary" : ""
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavbar;
