import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";

type ShoppingListItem = {
  name: string;
  link: string;
};

type ShoppingListCategory = {
  category: string;
  items: ShoppingListItem[];
};

interface ShoppingListDisplayProps {
  shoppingList: ShoppingListCategory[];
}

export function ShoppingListDisplay({ shoppingList }: ShoppingListDisplayProps) {
  if (!shoppingList || shoppingList.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {shoppingList.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Checkbox id={`item-${index}-${itemIndex}`} className="mt-1" />
                    <label htmlFor={`item-${index}-${itemIndex}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {item.name}
                    </label>
                  </div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" title={`Find ${item.name} online`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <LinkIcon className="h-4 w-4" />
                      <span className="sr-only">Find online</span>
                    </Button>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
