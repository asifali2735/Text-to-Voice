'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogIn, Mic } from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useUser } from '@/firebase';

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const menuItems = [
    { href: '/', label: 'Studio', icon: Mic },
  ];
  
  const authMenuItem = user
    ? { href: '/profile', label: 'Profile', icon: User }
    : { href: '/profile', label: 'Login', icon: LogIn };

  return (
    <>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {[...menuItems, authMenuItem].map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
