import type { RecommendContentOutput } from '@/ai/flows/content-recommendations';
import { VideoCard } from '@/components/video-card';

export function VideoFeed({ recommendations }: { recommendations: RecommendContentOutput['recommendations'] }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <p className="text-muted-foreground">No content to display.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {recommendations.map((rec, index) => (
        <VideoCard key={`${rec.videoTitle}-${index}`} recommendation={rec} />
      ))}
    </div>
  );
}
