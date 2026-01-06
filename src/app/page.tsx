"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { textToSpeech } from "@/ai/flows/tts-flow";

export default function AiStudioPage() {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text) return;
    setIsLoading(true);
    setAudio("");
    try {
      const response = await textToSpeech(text);
      if (response?.media) {
        setAudio(response.media);
      }
    } catch (error) {
      console.error("Failed to generate audio:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            AI Voice Over Studio
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Bring your text to life with generative AI.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to generate voice over..."
            className="w-full p-4 text-lg bg-input border-2 border-primary/50 focus:border-primary focus:ring-0"
            disabled={isLoading}
          />
          <Button
            onClick={handleGenerate}
            className="w-full text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground py-6 shadow-[0_0_20px_theme(colors.primary)]"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Voice"}
          </Button>
        </div>

        {audio && (
          <div className="p-4 bg-secondary rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Generated Audio</h2>
            <audio controls src={audio} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
