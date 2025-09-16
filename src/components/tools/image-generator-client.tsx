"use client";

import { useActionState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { generateImageAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ImageIcon as ImageIconLucide } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const initialState = {
  type: null,
  imageUrl: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <ImageIconLucide className="mr-2 h-4 w-4" />
          Generate Image
        </>
      )}
    </Button>
  );
}

export function ImageGeneratorClient() {
  const [state, formAction] = useActionState(generateImageAction, initialState);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { pending } = useFormStatus();

  useEffect(() => {
    setIsLoading(pending);
  }, [pending]);

  useEffect(() => {
    if(state.type === 'success' || state.type === 'error'){
        setIsLoading(false);
    }
    if (state.type === "error" && state.errors?._server) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.errors._server.join(", "),
      });
    }
  }, [state, toast]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form action={formAction} onSubmit={() => setIsLoading(true)}>
        <Card>
          <CardHeader>
            <CardTitle>Product Image Generator</CardTitle>
            <CardDescription>Enter a product name to generate an illustrative image for your shopping list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" name="productName" placeholder="e.g., 'Organic Apples'" required />
              {state.errors?.productName && <p className="text-sm text-destructive">{state.errors.productName[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      
      <Card>
        <CardHeader>
          <CardTitle>Generated Image</CardTitle>
          <CardDescription>Your AI-generated product image will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
            {isLoading ? (
                <Skeleton className="w-full aspect-square rounded-lg" />
            ) : state.type === "success" && state.imageUrl ? (
                <Image
                    src={state.imageUrl}
                    alt="Generated product image"
                    width={512}
                    height={512}
                    className="rounded-lg object-cover aspect-square"
                />
            ) : (
                <div className="flex items-center justify-center w-full aspect-square text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>Image will be generated here.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
