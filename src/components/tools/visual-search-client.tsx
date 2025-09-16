"use client";

import { useActionState } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { identifyProductAction } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, UploadCloud, Link as LinkIcon, Star } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const initialState = {
  type: null,
  product: null,
  errors: null,
};

export function VisualSearchClient() {
  const [state, formAction] = useActionState(identifyProductAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(false);
    if (state.type === "error") {
      const errorMessage = state.errors?._server?.join(", ") || "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Identification Failed",
        description: errorMessage,
      });
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);

        const formData = new FormData();
        formData.append('photoDataUri', result);
        formAction(formData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <form ref={formRef}>
            <input
              type="file"
              name="photo"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </form>
          {preview ? (
            <Image
              src={preview}
              alt="Image preview"
              width={400}
              height={400}
              className="w-full max-h-[400px] rounded-lg object-contain"
            />
          ) : (
            <div className="text-center p-8 border-2 border-dashed rounded-lg w-full">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Upload an image</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Take a picture of an item to identify it.
              </p>
            </div>
          )}
          <Button onClick={handleButtonClick} className="mt-6">
            <Camera className="mr-2 h-4 w-4" />
            {preview ? "Choose Another Image" : "Upload Image"}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ) : state.type === "success" && state.product ? (
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-primary">{state.product.productName}</h4>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />
                <span className="font-semibold">
                  Confidence: {Math.round(state.product.confidence * 100)}%
                </span>
              </div>
              <a
                href={state.product.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  View Product Online
                </Button>
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Product information will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
