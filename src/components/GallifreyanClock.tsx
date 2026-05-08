import React, { memo } from 'react';

export const GallifreyanClock: React.FC = memo(() => {
  return (
    <div className="relative w-full h-full flex items-center justify-center opacity-20 pointer-events-none">
      <div className="absolute w-[400px] h-[400px] border border-tardis-glow/20 rounded-full animate-spin-slow" />
      <div className="absolute w-[300px] h-[300px] border-2 border-tardis-glow/10 rounded-full animate-[spin-slow_45s_linear_infinite_reverse]" style={{ willChange: 'transform' }} />
      <div className="absolute w-[200px] h-[200px] border border-tardis-glow/30 rounded-full animate-[spin-slow_30s_linear_infinite]" style={{ willChange: 'transform' }} />
      
      {/* Decorative circles to mimic Doctor Who gallifreyan writing */}
      <div className="absolute top-10 left-10 w-20 h-20 border border-tardis-glow/40 rounded-full" />
      <div className="absolute bottom-20 right-10 w-32 h-32 border border-tardis-glow/20 rounded-full" />
      <div className="absolute top-1/2 left-20 w-8 h-8 bg-tardis-glow/20 rounded-full" />
    </div>
  );
});
