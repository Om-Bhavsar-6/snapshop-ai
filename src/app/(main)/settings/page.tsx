import { AppHeader } from "@/components/layout/app-header";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { HistoryPanel } from "@/components/settings/history-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader pageTitle="Settings" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeToggle />
            </CardContent>
          </Card>
          <HistoryPanel />
        </div>
      </main>
    </div>
  );
}
