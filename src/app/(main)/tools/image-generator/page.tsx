import { AppHeader } from "@/components/layout/app-header";
import { ImageGeneratorClient } from "@/components/tools/image-generator-client";

export default function ImageGeneratorPage() {
  return (
    <>
      <AppHeader pageTitle="Image Generator" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <ImageGeneratorClient />
      </main>
    </>
  );
}
