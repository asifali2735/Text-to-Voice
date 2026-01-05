'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Heart, MessageCircle, Send, Play, HeartPulse } from 'lucide-react';
import type { RecommendContentOutput } from '@/ai/flows/content-recommendations';
import { Badge } from './ui/badge';

type Recommendation = RecommendContentOutput['recommendations'][0];

const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

export function VideoCard({ recommendation }: { recommendation: Recommendation }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setLikes(Math.floor(Math.random() * 5000));
    setComments(Math.floor(Math.random() * 500));
  }, []);
  
  const creatorInitial = recommendation.creatorName.charAt(0).toUpperCase();
  const creatorHash = simpleHash(recommendation.creatorName);
  const avatarUrl = `https://picsum.photos/seed/${creatorHash}/40/40`;
  const videoUrl = `https://picsum.photos/seed/${creatorHash + 1}/400/700`;
  
  const handleLike = () => {
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev => !prev);
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-lg border-2">
      <CardHeader className="flex flex-row items-center gap-3 p-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={recommendation.creatorName} data-ai-hint="profile photo" />
          <AvatarFallback>{creatorInitial}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="font-headline font-semibold">{recommendation.creatorName}</p>
          <p className="text-xs text-muted-foreground font-light italic">"{recommendation.reason}"</p>
        </div>
        <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-primary">Follow</Button>
      </CardHeader>
      <CardContent className="p-0 relative aspect-[9/16] bg-muted">
        <Image
          src={videoUrl}
          alt={recommendation.videoTitle}
          fill
          className="object-cover"
          data-ai-hint="dancing person"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 p-1 bg-black/30 backdrop-blur-sm rounded-lg text-white">
          <HeartPulse className="w-4 h-4 text-primary" />
          <span className="font-headline text-xs">Jannu</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Play className="w-16 h-16 text-white/70 drop-shadow-lg" />
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-headline text-lg font-bold drop-shadow-md">{recommendation.videoTitle}</h3>
        </div>
        {recommendation.sponsored && (
          <Badge variant="secondary" className="absolute top-3 right-3 shadow-md">Sponsored</Badge>
        )}
      </CardContent>
      <CardFooter className="p-1 flex justify-around">
        <Button variant="ghost" className="flex-col h-auto py-2" onClick={handleLike}>
          <Heart className={`w-6 h-6 transition-all ${isLiked ? 'text-primary fill-current' : ''}`} />
          <span className="text-xs font-normal mt-1">{likes.toLocaleString()}</span>
        </Button>
        <Button variant="ghost" className="flex-col h-auto py-2">
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs font-normal mt-1">{comments.toLocaleString()}</span>
        </Button>
        <Button variant="ghost" className="flex-col h-auto py-2">
          <Send className="w-6 h-6" />
          <span className="text-xs font-normal mt-1">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
