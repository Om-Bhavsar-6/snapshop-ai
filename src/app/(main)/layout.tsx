import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false} open={false} sidebarWidth="20rem">
      <AppSidebar />
      <main className="relative flex min-h-svh flex-1 flex-col bg-background">
        {children}
      </main>
    </SidebarProvider>
  );
}
