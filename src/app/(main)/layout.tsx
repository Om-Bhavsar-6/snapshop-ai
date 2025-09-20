import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true} open={true} sidebarWidth="16rem">
      <AppSidebar />
      <main className="relative flex min-h-svh flex-1 flex-col bg-background">
        {children}
      </main>
    </SidebarProvider>
  );
}
