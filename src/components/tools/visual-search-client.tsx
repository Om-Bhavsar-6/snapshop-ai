"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { identifyProductAction } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, UploadCloud, Link as LinkIcon, Star } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const initialState = {
  type: null,
  product: null,
  errors: null,
};

export function VisualSearchClient() {
  const [state, formAction] = useActionState(identifyProductAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.type === "error") {
      const errorMessage = state.errors?._server?.join(", ") || "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Identification Failed",
        description: errorMessage,
      });
    }
    if (state.type === 'success'){
      // Clear the file input
        if(formRef.current) {
            formRef.current.reset();
        }
    }
  }, [state, toast]);
  
  const handleFormSubmit = (formData: FormData) => {
    const file = formData.get('photo') as File;
    if (!file || file.size === 0) {
        toast({
            variant: "destructive",
            title: "No Image Selected",
            description: "Please select an image to upload.",
        });
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        formData.set('photoDataUri', result);
        startTransition(() => {
            formAction(formData);
        });
    };
    reader.readAsDataURL(file);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = e.currentTarget.form;
    if (form) {
      const formData = new FormData(form);
      handleFormSubmit(formData);
    }
  };


  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <form action={handleFormSubmit} ref={formRef}>
            <input
              type="file"
              name="photo"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            {preview ? (
                <div className="relative">
                    <Image
                        src={preview}
                        alt="Image preview"
                        width={400}
                        height={400}
                        className="w-full max-h-[400px] rounded-lg object-contain"
                    />
                </div>
            ) : (
                <div className="text-center p-8 border-2 border-dashed rounded-lg w-full">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Upload an image</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                      Click the button to upload an item image.
                  </p>
                </div>
            )}
            <div className="flex justify-center">
              <Button onClick={() => fileInputRef.current?.click()} className="mt-6" type="button" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Identifying...
                    </>
                ) : (
                    <>
                        <Camera className="mr-2 h-4 w-4" />
                        {preview ? 'Change Image' : 'Upload Image'}
                    </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          {isPending ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="border rounded-md">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full border-t" />
                <Skeleton className="h-12 w-full border-t" />
              </div>
            </div>
          ) : state.type === "success" && state.product ? (
            <div className="space-y-4">
                <div>
                    <h4 className="text-2xl font-bold text-primary">{state.product.productName}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />
                        <span className="font-semibold">
                        Confidence: {Math.round(state.product.confidence * 100)}%
                        </span>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Platform</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Link</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {state.product.purchasingOptions?.map((option: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{option.platform}</TableCell>
                                <TableCell>{option.price}</TableCell>
                                <TableCell className="text-right">
                                <a href={option.link} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon">
                                    <LinkIcon className="h-4 w-4" />
                                    </Button>
                                </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(!state.product.purchasingOptions || state.product.purchasingOptions.length === 0) && (
                    <p className="text-muted-foreground text-sm">No purchasing options found.</p>
                )}
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
