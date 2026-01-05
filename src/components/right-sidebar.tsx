import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash } from 'lucide-react';
import { SponsoredContentTool } from './sponsored-content-tool';

const trendingTopics = [
  '#DanceChallenge',
  '#SummerVibes',
  '#DIYCrafts',
  '#PetLife',
  '#Foodie',
];

export function RightSidebar() {
  return (
    <aside className="hidden lg:block w-[350px] p-4 space-y-6 border-l h-screen overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Hash className="text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {trendingTopics.map((topic) => (
              <li key={topic}>
                <a href="#" className="font-semibold hover:text-primary transition-colors">
                  {topic}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <SponsoredContentTool />
    </aside>
  );
}
