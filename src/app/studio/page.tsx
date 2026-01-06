'use client';

import { useState } from 'react';
import { Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { AppLogo } from '@/components/app-logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RightSidebar } from '@/components/right-sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mic } from 'lucide-react';
import { textToSpeech, TextToSpeechOutput } from '@/ai/flows/text-to-speech';
import { Skeleton } from '@/components/ui/skeleton';

function AIStudio() {
  const [text, setText] = useState('Hello, welcome to Jannu Live! This is an AI generated voice over.');
  const [audioResult, setAudioResult] = useState<TextToSpeechOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVoice = async () => {
    setIsLoading(true);
    setError(null);
    setAudioResult(null);
    try {
      const result = await textToSpeech(text);
      setAudioResult(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Mic className="text-primary" />
          AI Voice Over Studio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="voice-text">Text to convert</Label>
          <Textarea
            id="voice-text"
            placeholder="Enter the text you want to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button onClick={handleGenerateVoice} disabled={isLoading || !text} className="w-full">
          {isLoading ? 'Generating Audio...' : 'Generate Voice Over'}
        </Button>
        {isLoading && (
            <div className="w-full space-y-2">
                <Skeleton className="h-12 w-full" />
            </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {audioResult?.media && (
          <div className="w-full">
            <h3 className="font-semibold mb-2">Result:</h3>
            <audio controls src={audioResult.media} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}


export default function StudioPage() {
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarNav />
      </Sidebar>
      <div className="flex flex-1">
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md">
            <SidebarTrigger />
            <div className="flex-1 text-center sm:text-left">
              <div className="sm:hidden">
                <AppLogo />
              </div>
               <h1 className="hidden sm:block text-2xl font-headline font-bold text-primary">AI Studio</h1>
            </div>
          </header>
          <main className="flex-1">
            <ScrollArea className="h-[calc(100svh-57px)]">
              <div className="p-4 sm:p-6">
                <AIStudio />
              </div>
            </ScrollArea>
          </main>
        </SidebarInset>
        <RightSidebar />
      </div>
    </>
  );
}
