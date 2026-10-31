import React from 'react';

interface VoiceVisualizerProps {
  state: 'idle' | 'speaking' | 'listening' | 'thinking';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  state,
  size = 'md',
  className = '',
}) => {
  const barCounts = size === 'sm' ? 12 : size === 'lg' ? 28 : 20;
  const bars = Array.from({ length: barCounts });

  // Determine heights and animations based on state
  const getBarStyle = (index: number) => {
    if (state === 'listening') {
      // Dynamic bouncing bars
      const delay = (index % 5) * 0.15;
      const duration = 0.6 + (index % 3) * 0.2;
      return {
        animation: `wave-bar ${duration}s ease-in-out ${delay}s infinite`,
        backgroundColor: '#10B981', // emerald
      };
    }

    if (state === 'speaking') {
      const delay = (index % 4) * 0.12;
      const duration = 0.8 + (index % 4) * 0.15;
      return {
        animation: `wave-bar ${duration}s ease-in-out ${delay}s infinite`,
        backgroundColor: '#8B5CF6', // purple
      };
    }

    if (state === 'thinking') {
      const delay = index * 0.05;
      return {
        animation: `wave-bar 1.4s ease-in-out ${delay}s infinite`,
        backgroundColor: '#38BDF8', // sky blue
      };
    }

    // Idle
    return {
      transform: 'scaleY(0.25)',
      backgroundColor: '#64748B', // muted slate
      transition: 'all 0.3s ease',
    };
  };

  const containerHeights = {
    sm: 'h-8',
    md: 'h-14',
    lg: 'h-20',
  };

  return (
    <div
      className={`flex items-center justify-center gap-1.5 ${containerHeights[size]} ${className}`}
      aria-label={`Voice visualizer ${state}`}
    >
      {bars.map((_, i) => (
        <span
          key={i}
          className="w-1 rounded-full transition-all duration-200"
          style={{
            height: '100%',
            ...getBarStyle(i),
          }}
        />
      ))}
    </div>
  );
};
