'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

type HistoryItem = {
  type: 'Shopping List' | 'Visual Search' | 'Review Polish' | 'Image Generation';
  query: any;
  timestamp: number;
};

export function HistoryPanel() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('snapshop-history');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
    } catch (e) {
        console.error("Failed to read history from localStorage:", e);
        // If parsing fails, clear the corrupted history
        localStorage.removeItem('snapshop-history');
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('snapshop-history');
    setHistory([]);
  };

  const renderQuery = (item: HistoryItem) => {
    switch (item.type) {
      case 'Shopping List':
      case 'Image Generation':
        return <p className="text-sm text-muted-foreground truncate">"{item.query}"</p>;
      case 'Review Polish':
        return (
          <div className="text-sm text-muted-foreground truncate">
            <p className="font-medium">{item.query.productName}</p>
            <p>"{item.query.review}"</p>
          </div>
        );
      case 'Visual Search':
        return <Image src={item.query} alt="Visual search history item" width={40} height={40} className="rounded-md object-cover" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search History</CardTitle>
        <CardDescription>Your recent activity within the app.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full pr-4">
          {history.length > 0 ? (
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                      <p className="font-semibold">{item.type}</p>
                      {renderQuery(item)}
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">No history yet.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      {history.length > 0 && (
        <CardFooter className="border-t pt-6">
          <Button variant="outline" onClick={clearHistory}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
