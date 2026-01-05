'use client';

import { useIsMobile } from '@/hooks/use-mobile';

export function WindowView({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen w-screen bg-gray-200 dark:bg-gray-800 flex items-center justify-center p-4">
      <div className="relative h-full max-h-[900px] w-full max-w-[450px] overflow-hidden rounded-3xl border-[10px] border-black shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl" />
        <div className="h-full w-full bg-background overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
