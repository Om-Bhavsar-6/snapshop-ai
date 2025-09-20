"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import {
  List,
  Camera,
  MessageSquareQuote,
  ImageIcon,
  Settings,
  LogOut,
  Info,
  Wand2,
  Home,
} from "lucide-react";

const mainNav = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/visual-search",
    label: "Visual Search",
    icon: Camera,
  },
];

const toolsNav = [
  {
    href: "/tools/review-summarizer",
    label: "Review Summarizer",
    icon: MessageSquareQuote,
  },
  {
    href: "/tools/image-generator",
    label: "Image Generator",
    icon: ImageIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
    return pathname === href;
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarMenu>
          {mainNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                  className="group-data-[collapsible=icon]:justify-center"
                >
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarMenu className="mt-4">
          <SidebarMenuItem className="px-2 group-data-[collapsible=icon]:hidden">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              AI Tools
            </div>
          </SidebarMenuItem>
          {toolsNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                   className="group-data-[collapsible=icon]:justify-center"
                >
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings"  className="group-data-[collapsible=icon]:justify-center">
              <Settings />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/about" passHref>
                <SidebarMenuButton tooltip="About Us" isActive={isActive('/about')}  className="group-data-[collapsible=icon]:justify-center">
                    <Info />
                    <span className="group-data-[collapsible=icon]:hidden">About Us</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-auto p-2 group-data-[collapsible=icon]:p-0">
             <Logo />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
