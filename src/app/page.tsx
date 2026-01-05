import { recommendContent, RecommendContentOutput } from '@/ai/flows/content-recommendations';
import { SidebarNav } from '@/components/sidebar-nav';
import { RightSidebar } from '@/components/right-sidebar';
import { VideoFeed } from '@/components/video-feed';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarProvider, SidebarInset, Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { AppLogo } from '@/components/app-logo';

export default async function Home() {
  const userHistory = "viewed cooking videos, liked a video on 'how to make pasta', scrolled past a sports clip";
  const interests = "cooking, Italian food, DIY";
  const sponsoredContentRequest = "user seems engaged, consider showing a sponsored post related to their interests";

  let recommendations: RecommendContentOutput['recommendations'] = [];
  try {
    const result = await recommendContent({
      userHistory,
      interests,
      sponsoredContentRequest,
    });
    recommendations = result.recommendations;
  } catch (error) {
    console.error("Failed to fetch content recommendations:", error);
  }

  if (!recommendations || recommendations.length === 0) {
    recommendations = [
      { videoTitle: 'My Morning Routine', creatorName: 'LifestyleLover', reason: 'Because you like morning vlogs.', sponsored: false },
      { videoTitle: 'Ultimate Pasta Recipe', creatorName: 'ChefMaster', reason: 'Because you are interested in cooking.', sponsored: true },
      { videoTitle: 'Funny Cat Moments', creatorName: 'CatCrazy', reason: 'Popular video.', sponsored: false },
    ];
  }

  return (
    <SidebarProvider>
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
               <h1 className="hidden sm:block text-2xl font-headline font-bold text-primary">Jannu Connect</h1>
            </div>
          </header>
          <main className="flex-1">
            <ScrollArea className="h-[calc(100vh-57px)] lg:h-screen">
              <div className="container mx-auto max-w-md px-2 py-8 sm:px-4">
                <VideoFeed recommendations={recommendations} />
              </div>
            </ScrollArea>
          </main>
        </SidebarInset>
        <RightSidebar />
      </div>
    </SidebarProvider>
  );
}
