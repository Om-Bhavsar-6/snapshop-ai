import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VisualSearchClient } from "@/components/tools/visual-search-client";

export default function VisualSearchPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader pageTitle="Visual Search" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Snap & Shop</h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Got an item you want? Take a picture, and our AI will find it online for you in seconds.
                </p>
            </div>
            <VisualSearchClient />
        </div>
      </main>
    </div>
  );
}
