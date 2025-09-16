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
    
    // Match headings like ## Category or # Category
    const categoryMatch = trimmedLine.match(/^(#+)\s(.+)/);
    if (categoryMatch) {
      if (currentCategory) {
        parsed.push(currentCategory);
      }
      currentCategory = {
        category: categoryMatch[2].trim(),
        items: []
      };
    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        // If an item appears before any category, create a default 'General' category
        if (!currentCategory) {
            currentCategory = { category: 'General', items: [] };
        }
        currentCategory.items.push({
            text: trimmedLine.substring(2).trim(),
            checked: false
        });
    } else if (currentCategory && currentCategory.items.length > 0) {
      // This handles multi-line items. Append to the last item.
      const lastItem = currentCategory.items[currentCategory.items.length - 1];
      if(lastItem) {
        lastItem.text += ` ${trimmedLine}`;
      }
    }
  });

  if (currentCategory && currentCategory.items.length > 0) {
    parsed.push(currentCategory);
  }
  
  // Create a default category if no categories were parsed but there was text
  if (parsed.length === 0 && listText.trim().length > 0) {
      const items = listText.split('\n')
        .map(line => line.trim().replace(/^(-|\*)\s*/, ''))
        .filter(line => line.length > 0)
        .map(text => ({ text, checked: false }));

      if (items.length > 0) {
          parsed.push({ category: 'Shopping List', items });
      }
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
