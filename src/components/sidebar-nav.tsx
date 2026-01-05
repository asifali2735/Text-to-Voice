'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flame, PlusSquare, Bell, User, RadioTower } from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/live', label: 'Live', icon: RadioTower },
    { href: '#', label: 'Discover', icon: Flame },
    { href: '#', label: 'Create', icon: PlusSquare },
    { href: '#', label: 'Notifications', icon: Bell },
    { href: '#', label: 'Profile', icon: User },
  ];

  return (
    <>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
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
