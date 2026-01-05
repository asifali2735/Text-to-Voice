'use client';

import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Smartphone, Tablet } from 'lucide-react';

export function WindowView({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet'>('mobile');

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen w-screen bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'mobile' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setViewMode('mobile')}
        >
          <Smartphone className="mr-2" /> Mobile
        </Button>
        <Button
          variant={viewMode === 'tablet' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setViewMode('tablet')}
        >
          <Tablet className="mr-2" /> Tablet
        </Button>
      </div>
      <div
        className={cn(
          "relative h-full max-h-[900px] w-full overflow-hidden rounded-3xl border-[10px] border-black shadow-2xl transition-all duration-300",
          viewMode === 'mobile' ? "max-w-[450px]" : "max-w-[768px]"
        )}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20" />
        <div className="h-full w-full bg-background overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
