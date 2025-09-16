"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { createShoppingListAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShoppingListDisplay } from "./shopping-list-display";
import { Wand2, Loader2 } from "lucide-react";

const initialState = {
  type: null,
  shoppingList: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate List
        </>
      )}
    </Button>
  );
}

export function ShoppingListForm() {
  const [state, formAction] = useFormState(createShoppingListAction, initialState);
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
    <div className="space-y-8">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Create Your Shopping List</CardTitle>
            <CardDescription>Describe what you need, and let AI create a categorized list for you. For example: "I'm hosting a pizza night for 4 people."</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-2">
              <Label htmlFor="description">Your Needs</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What are you planning?"
                rows={4}
                required
              />
              {state.errors?.description && (
                <p className="text-sm text-destructive">{state.errors.description[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      
      {state.type === "success" && state.shoppingList && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Generated List</h2>
          <ShoppingListDisplay shoppingList={state.shoppingList} />
        </div>
      )}
    </div>
  );
}
