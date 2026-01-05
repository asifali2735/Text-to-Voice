import { Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { AppLogo } from '@/components/app-logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RightSidebar } from '@/components/right-sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioTower } from 'lucide-react';

export default function LivePage() {
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
               <h1 className="hidden sm:block text-2xl font-headline font-bold text-primary">Jannu Live</h1>
            </div>
          </header>
          <main className="flex-1">
            <ScrollArea className="h-[calc(100svh-57px)]">
              <div className="p-4 sm:p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                      <RadioTower className="text-primary" />
                      Live Streams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground">Live content will appear here.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </main>
        </SidebarInset>
        <RightSidebar />
      </div>
    </>
  );
}
