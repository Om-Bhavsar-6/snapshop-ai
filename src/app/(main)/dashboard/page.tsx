import { AppHeader } from "@/components/layout/app-header";
import { ShoppingListForm } from "@/components/dashboard/shopping-list-form";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader pageTitle="Shopping List Generator" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <ShoppingListForm />
      </main>
    </div>
  );
}
