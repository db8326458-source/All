import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Wrench, Sparkles, MapPin } from 'lucide-react';

interface SplashProps {
  onFinish: () => void;
}

export const CustomerSplash: React.FC<SplashProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white min-h-[500px]">
      <div className="w-full flex justify-end">
        <button 
          onClick={onFinish}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
            <span className="text-3xl font-black tracking-tight text-white">HW</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-slate-900">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          HELP WORLD
        </h1>
        <p className="text-blue-200 text-sm font-medium tracking-wide">
          Find Trusted Help, Anywhere.
        </p>

        {/* Loading Spinner */}
        <div className="mt-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping delay-150" />
          <div className="w-2 h-2 rounded-full bg-blue-300 animate-ping delay-300" />
        </div>
      </div>

      <div className="text-[11px] text-slate-500 font-medium">
        Verified Local Services • Electricians • Plumbers • HVAC
      </div>
    </div>
  );
};

export const CustomerOnboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      icon: MapPin,
      badge: 'Step 1 of 3',
      title: 'Find Nearby Professionals',
      description: 'Discover certified electricians, plumbers, mechanics, and cleaners verified in your neighborhood.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: ShieldCheck,
      badge: 'Step 2 of 3',
      title: 'Verified Badges & Real Reviews',
      description: 'Every partner holds government ID, license documentation, and real customer reviews you can trust.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: Wrench,
      badge: 'Step 3 of 3',
      title: 'Book Instantly With Clear Pricing',
      description: 'Transparent visit fees, upfront labor estimates, real-time in-app status updates, and live chat.',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const current = slides[slide];
  const Icon = current.icon;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white min-h-[550px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          {current.badge}
        </span>
        <button 
          onClick={onComplete}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700"
        >
          Skip
        </button>
      </div>

      <div className="my-auto py-4 flex flex-col items-center text-center">
        <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 shadow-md relative">
          <img 
            src={current.image} 
            alt={current.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {current.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
          {current.description}
        </p>

        {/* Carousel Dots */}
        <div className="flex items-center gap-1.5 mt-6">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200'
              }`} 
            />
          ))}
        </div>
      </div>

      <div className="pt-4">
        {slide < slides.length - 1 ? (
          <button
            onClick={() => setSlide(s => s + 1)}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 text-sm transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 text-sm transition-all"
          >
            <span>Explore Help World</span>
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
