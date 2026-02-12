"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

export function AppHeader({ pageTitle }: { pageTitle: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">{pageTitle}</h1>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 w-64" />
        </div>
      </div>
    </header>
  );
}
