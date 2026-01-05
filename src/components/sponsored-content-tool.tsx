'use client';

import { useState } from 'react';
import { adjustSponsoredContent, type AdjustSponsoredContentOutput, type AdjustSponsoredContentInput } from '@/ai/flows/gen-ai-related-content';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bot } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const defaultEngagementData = JSON.stringify(
  {
    "user_id": "user-123",
    "session_duration_minutes": 15,
    "videos_viewed": 25,
    "likes": 8,
    "comments": 1,
    "shares": 2,
    "ad_clicks": 0,
    "ad_views": 5
  },
  null,
  2
);

export function SponsoredContentTool() {
  const [input, setInput] = useState<AdjustSponsoredContentInput>({
    userEngagementData: defaultEngagementData,
    currentAdFrequency: 0.1,
    currentAdPlacement: 'feed',
  });
  const [result, setResult] = useState<AdjustSponsoredContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await adjustSponsoredContent(input);
      setResult(res);
    } catch (e) {
      setError('Failed to get recommendation. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bot className="text-primary" />
          Sponsored Content AI
        </CardTitle>
        <CardDescription>
          Adjust ad strategy based on user engagement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="engagement-data">User Engagement (JSON)</Label>
          <Textarea
            id="engagement-data"
            value={input.userEngagementData}
            onChange={(e) => setInput({ ...input, userEngagementData: e.target.value })}
            rows={8}
            className="font-code text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label>Current Ad Frequency: {input.currentAdFrequency.toFixed(2)}</Label>
          <Slider
            value={[input.currentAdFrequency]}
            onValueChange={([val]) => setInput({ ...input, currentAdFrequency: val })}
            max={1}
            step={0.05}
          />
        </div>
        <div className="space-y-2">
          <Label>Current Ad Placement</Label>
          <RadioGroup
            value={input.currentAdPlacement}
            onValueChange={(val) => setInput({ ...input, currentAdPlacement: val as 'feed' | 'side bar' })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="feed" id="feed" />
              <Label htmlFor="feed">Feed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="side bar" id="side-bar" />
              <Label htmlFor="side-bar">Side Bar</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? 'Optimizing...' : 'Optimize Placement'}
        </Button>
        {isLoading && (
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <Card className="w-full bg-secondary">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="font-headline text-base">Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Frequency:</strong> {result.adjustedAdFrequency.toFixed(2)}</p>
              <p><strong>Placement:</strong> <span className="capitalize">{result.adjustedAdPlacement}</span></p>
              <p><strong>Reasoning:</strong> {result.reasoning}</p>
            </CardContent>
          </Card>
        )}
      </CardFooter>
    </Card>
  );
}
