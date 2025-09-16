"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { summarizeReviewsAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

const initialState = {
  type: null,
  summary: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Summarizing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Summarize Reviews
        </>
      )}
    </Button>
  );
}

export function ReviewSummarizerClient() {
  const [state, formAction] = useFormState(summarizeReviewsAction, initialState);
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
            <CardTitle>Review Summarizer</CardTitle>
            <CardDescription>Paste product reviews to get a concise AI-powered summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" name="productName" placeholder="e.g., 'Wireless Headphones'" required />
              {state.errors?.productName && <p className="text-sm text-destructive">{state.errors.productName[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviews">Customer Reviews</Label>
              <Textarea id="reviews" name="reviews" placeholder="Paste customer reviews here..." rows={10} required />
              {state.errors?.reviews && <p className="text-sm text-destructive">{state.errors.reviews[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
          <CardDescription>The key takeaways from the reviews will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.type === "success" && state.summary ? (
            <div className="prose prose-sm max-w-none text-foreground">
              <p>{state.summary}</p>
            </div>
          ) : (
             <div className="flex items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Summary will be generated here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
