import React from 'react';
import { 
  Zap, 
  Wrench, 
  Car, 
  Wind, 
  Hammer, 
  Sparkles, 
  Cpu, 
  Paintbrush, 
  Key, 
  HelpCircle 
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name?.toLowerCase()) {
    case 'zap':
    case 'electrician':
      return <Zap className={className} />;
    case 'wrench':
    case 'plumber':
      return <Wrench className={className} />;
    case 'car':
    case 'mechanic':
      return <Car className={className} />;
    case 'wind':
    case 'ac-repair':
    case 'ac repair':
      return <Wind className={className} />;
    case 'hammer':
    case 'carpenter':
      return <Hammer className={className} />;
    case 'sparkles':
    case 'cleaner':
      return <Sparkles className={className} />;
    case 'cpu':
    case 'appliance-repair':
    case 'appliance repair':
      return <Cpu className={className} />;
    case 'paintbrush':
    case 'painter':
      return <Paintbrush className={className} />;
    case 'key':
    case 'locksmith':
      return <Key className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
