import { HeartPulse } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary rounded-lg">
        <HeartPulse className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-headline font-bold text-primary group-data-[state=collapsed]:hidden">Jannu Live</h1>
    </div>
  );
}
