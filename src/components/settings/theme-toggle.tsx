"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="space-y-2">
        <Label>Theme</Label>
        <div className="flex gap-2">
            <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
            >
                <Sun className="mr-2 h-4 w-4" />
                Light
            </Button>
            <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
            >
                <Moon className="mr-2 h-4 w-4" />
                Dark
            </Button>
            <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
            >
                <Laptop className="mr-2 h-4 w-4" />
                System
            </Button>
        </div>
    </div>
  );
}
