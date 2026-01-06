'use client';

import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  initiateEmailSignUp,
  initiateEmailSignIn,
  initiateAnonymousSignIn,
} from '@/firebase/non-blocking-login';
import { signOut } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { AppLogo } from '@/components/app-logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon, LogOut } from 'lucide-react';
import { collection, doc } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

function AuthForm() {
  const auth = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignUp = (values: z.infer<typeof formSchema>) => {
    if (!auth) return;
    initiateEmailSignUp(auth, values.email, values.password);
  };

  const handleSignIn = (values: z.infer<typeof formSchema>) => {
    if (!auth) return;
    initiateEmailSignIn(auth, values.email, values.password);
  };
  
  const handleAnonymousSignIn = () => {
    if (!auth) return;
    initiateAnonymousSignIn(auth);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline">Join Jannu Live</CardTitle>
        <CardDescription>
          Sign up or sign in to continue.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex gap-2 w-full">
                <Button type="button" onClick={form.handleSubmit(handleSignIn)} className="flex-1">Sign In</Button>
                <Button type="button" onClick={form.handleSubmit(handleSignUp)} variant="secondary" className="flex-1">Sign Up</Button>
            </div>

            <Separator className="my-2" />
            
            <Button type="button" onClick={handleAnonymousSignIn} variant="outline" className="w-full">
              Continue as Guest
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function UserProfile() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleSignOut = () => {
    if (auth) {
      signOut(auth);
    }
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  const followersQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'followers') : null, [firestore, user]);
  const followingQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'following') : null, [firestore, user]);

  const { data: followers } = useCollection(followersQuery);
  const { data: following } = useCollection(followingQuery);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || user.email || 'User'} data-ai-hint="profile photo" />}
          <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline">{user?.displayName || user?.email || 'User'}</CardTitle>
        <CardDescription>{user?.isAnonymous ? 'Guest User' : 'Welcome to Jannu Live!'}</CardDescription>
        
        <div className="flex gap-4 pt-4">
            <div className="text-center">
                <p className="font-bold text-lg">{following?.length ?? 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div className="text-center">
                <p className="font-bold text-lg">{followers?.length ?? 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
                <p className="font-bold text-lg">0</p>
                <p className="text-sm text-muted-foreground">Likes</p>
            </div>
        </div>

      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">Your saved audio will appear here.</p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="outline" className="w-full">Edit Profile</Button>
        <Button onClick={handleSignOut} variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();

  const renderContent = () => {
    if (isUserLoading) {
      return (
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex justify-center gap-8">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
          <Skeleton className="h-10 w-full" />
           <Skeleton className="h-10 w-full" />
        </div>
      );
    }
    if (user) {
      return <UserProfile />;
    }
    return <AuthForm />;
  };

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
              <h1 className="hidden sm:block text-2xl font-headline font-bold text-primary">
                Profile
              </h1>
            </div>
          </header>
          <main className="flex-1">
            <ScrollArea className="h-[calc(100svh-57px)]">
              <div className="p-4 sm:p-6 flex items-center justify-center">
                {renderContent()}
              </div>
            </ScrollArea>
          </main>
        </SidebarInset>
      </div>
    </>
  );
}
