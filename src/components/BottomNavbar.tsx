
import React from 'react';
import { Calendar, Home, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BottomNavbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around items-center z-50">
      <Link to="/" className="flex flex-col items-center p-2 text-primary">
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link to="/" className="flex flex-col items-center p-2 text-muted-foreground">
        <Calendar size={24} />
        <span className="text-xs mt-1">Calendar</span>
      </Link>
      <Link to="/" className="flex flex-col items-center p-2 text-muted-foreground">
        <Heart size={24} />
        <span className="text-xs mt-1">Tips</span>
      </Link>
      <Link to="/" className="flex flex-col items-center p-2 text-muted-foreground">
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNavbar;
