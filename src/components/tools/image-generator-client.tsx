"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { generateImageAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ImageIcon as ImageIconLucide, Link as LinkIcon, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const initialState = {
  type: null,
  imageUrl: null,
  product: null,
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
          Generate & Find
        </>
      )}
    </Button>
  );
}

export function ImageGeneratorClient() {
  const [state, formAction] = useActionState(generateImageAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.type === "error" && state.errors?._server) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.errors._server.join(", "),
      });
    } else if (state.type === 'success' && (state as any).query) {
      try {
        const newHistoryItem = { type: 'Image Generation', query: (state as any).query, timestamp: Date.now() };
        const history = JSON.parse(localStorage.getItem('snapshop-history') || '[]');
        history.unshift(newHistoryItem);
        localStorage.setItem('snapshop-history', JSON.stringify(history.slice(0, 50)));
      } catch (e) {
        console.error("Failed to save history:", e);
      }
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Product Image Generator</CardTitle>
            <CardDescription>Enter a product name to generate an illustrative image and find it for sale online.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" name="productName" placeholder="e.g., 'Red Wireless Headphones'" required />
              {state.errors?.productName && <p className="text-sm text-destructive">{state.errors.productName[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      
      {state.type === "success" && (state.imageUrl || state.product) && (
        <Card>
            <CardHeader>
                <CardTitle>Generated Results</CardTitle>
                <CardDescription>Here's your generated image and the best web matches we found.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-2">
                <div className="flex items-center justify-center">
                    {state.imageUrl ? (
                        <Image
                            src={state.imageUrl}
                            alt="Generated product image"
                            width={512}
                            height={512}
                            className="rounded-lg object-cover aspect-square"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full aspect-square text-muted-foreground border-2 border-dashed rounded-lg">
                            <p>Image could not be generated.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {state.product && state.product.productName ? (
                        <>
                            <div>
                                <h4 className="text-2xl font-bold text-primary">{state.product.productName}</h4>
                                {state.product.confidence > 0 && (
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />
                                        <span className="font-semibold">
                                        Confidence: {Math.round(state.product.confidence * 100)}%
                                        </span>
                                    </div>
                                )}
                            </div>
                            {state.product.purchasingOptions && state.product.purchasingOptions.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead>Platform</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="text-right">Link</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {state.product.purchasingOptions.map((option: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{option.platform}</TableCell>
                                                <TableCell>{option.price}</TableCell>
                                                <TableCell className="text-right">
                                                <a href={option.link} target="_blank" rel="noopener noreferrer" title={`Find on ${option.platform}`}>
                                                    <Button variant="ghost" size="icon">
                                                      <LinkIcon className="h-4 w-4" />
                                                      <span className="sr-only">Product Link</span>
                                                    </Button>
                                                </a>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground text-sm pt-4">No purchasing options found for the generated image.</p>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg p-8">
                            <p>Could not identify a matching product online.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
