import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface ShoppingListDisplayProps {
  shoppingList: string;
}

type ParsedListItem = {
  text: string;
  checked: boolean;
};

type ParsedList = {
  category: string;
  items: ParsedListItem[];
};

function parseShoppingList(listText: string): ParsedList[] {
  if (!listText) return [];

  const lines = listText.split('\n').filter(line => line.trim() !== '');
  const parsed: ParsedList[] = [];
  let currentCategory: ParsedList | null = null;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('## ') || trimmedLine.startsWith('# ')) {
      if (currentCategory) {
        parsed.push(currentCategory);
      }
      currentCategory = {
        category: trimmedLine.replace(/^[#\s]+/, ''),
        items: []
      };
    } else if ((trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) && currentCategory) {
      currentCategory.items.push({
        text: trimmedLine.substring(2),
        checked: false
      });
    } else if (currentCategory) {
      // If a line doesn't start with a list marker, append it to the last item
      const lastItem = currentCategory.items[currentCategory.items.length - 1];
      if(lastItem) {
        lastItem.text += ` ${trimmedLine}`;
      }
    } else {
        // Handle case where list items appear before any category
        if(parsed.length === 0) {
            currentCategory = { category: 'General', items: [] };
            parsed.push(currentCategory);
        }
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            currentCategory.items.push({
                text: trimmedLine.substring(2),
                checked: false
            });
        }
    }
  });

  if (currentCategory) {
    parsed.push(currentCategory);
  }

  return parsed;
}

export function ShoppingListDisplay({ shoppingList }: ShoppingListDisplayProps) {
  const parsedList = parseShoppingList(shoppingList);

  if (parsedList.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {parsedList.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <Checkbox id={`item-${index}-${itemIndex}`} className="mt-1" />
                  <label htmlFor={`item-${index}-${itemIndex}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {item.text}
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
