import { AppHeader } from "@/components/layout/app-header";
import { ReviewSummarizerClient } from "@/components/tools/review-summarizer-client";

export default function ReviewSummarizerPage() {
  return (
    <>
      <AppHeader pageTitle="Review Summarizer" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <ReviewSummarizerClient />
      </main>
    </>
  );
}
