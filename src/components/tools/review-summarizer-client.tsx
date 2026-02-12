"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { polishReviewAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

const initialState = {
  type: null,
  polishedReview: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Polishing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Polish Review
        </>
      )}
    </Button>
  );
}

export function ReviewSummarizerClient() {
  const [state, formAction] = useActionState(polishReviewAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
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
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Review Polisher</CardTitle>
            <CardDescription>Write a short or grammatically incorrect review and let AI polish it into a well-written one.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" name="productName" placeholder="e.g., 'Wireless Headphones'" required />
              {state.errors?.productName && <p className="text-sm text-destructive">{state.errors.productName[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea id="review" name="review" placeholder="e.g., 'this headphone bad sound not worth it'" rows={10} required />
              {state.errors?.review && <p className="text-sm text-destructive">{state.errors.review[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      
      <Card>
        <CardHeader>
          <CardTitle>Polished Review</CardTitle>
          <CardDescription>The improved version of your review will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.type === "success" && state.polishedReview ? (
            <div className="prose prose-sm max-w-none text-foreground">
              <p>{state.polishedReview}</p>
            </div>
          ) : (
             <div className="flex items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Polished review will be generated here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
