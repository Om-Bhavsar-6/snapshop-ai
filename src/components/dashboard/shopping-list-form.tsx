"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { createShoppingListAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShoppingListDisplay } from "./shopping-list-display";
import { Wand2, Loader2, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const initialState = {
  type: null,
  shoppingList: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
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
  const [state, formAction] = useActionState(createShoppingListAction, initialState);
  const { toast } = useToast();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.type === "error" && state.errors?._server) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.errors._server.join(", "),
      });
    } else if (state.type === 'success' && (state as any).query) {
      try {
        const newHistoryItem = { type: 'Shopping List', query: (state as any).query, timestamp: Date.now() };
        const history = JSON.parse(localStorage.getItem('snapshop-history') || '[]');
        history.unshift(newHistoryItem);
        // Limit history to 50 items
        localStorage.setItem('snapshop-history', JSON.stringify(history.slice(0, 50)));
      } catch (e) {
        console.error("Failed to save history:", e);
      }
    }
  }, [state, toast]);

  const handleDownloadTxt = () => {
    if (!state.shoppingList || !Array.isArray(state.shoppingList)) return;

    const textContent = (state.shoppingList as { category: string; items: { name: string, link: string }[] }[]).map(category => {
        const items = category.items.map(item => `  - ${item.name} (${item.link})`).join('\n');
        return `## ${category.category}\n${items}`;
    }).join('\n\n');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    if (!listRef.current) return;
    html2canvas(listRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth - 20; // with margin
      const height = width / ratio;
      
      let position = 10; // top margin
      
      if (height <= pdfHeight - 20) {
        pdf.addImage(imgData, 'PNG', 10, position, width, height);
      } else {
        // This is a simplified approach for multi-page. For very long lists, a more robust solution would be needed.
        let y = 0;
        const pageHeight = (canvasWidth / pdfWidth) * pdfHeight;
        while(y < canvasHeight){
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvasWidth;
          pageCanvas.height = pageHeight;
          const ctx = pageCanvas.getContext('2d');
          if(ctx){
            ctx.drawImage(canvas, 0, y, canvasWidth, pageHeight, 0, 0, canvasWidth, pageHeight);
            pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 10, position, width, (width / (canvasWidth / pageHeight)));
            y += pageHeight;
            if(y < canvasHeight){
              pdf.addPage();
            }
          }
        }
      }

      pdf.save('shopping-list.pdf');
    });
  };

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
      
      {state.type === "success" && state.shoppingList && Array.isArray(state.shoppingList) && (
        <div >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Generated List</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleDownloadTxt}>As TXT</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadPdf}>As PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
          <div ref={listRef}>
            <ShoppingListDisplay shoppingList={state.shoppingList} />
          </div>
        </div>
      )}
    </div>
  );
}
