"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const ThemeToggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isTop?: boolean }
>(({ isTop = false, ...props }, ref) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-5 h-5 flex items-center justify-center p-1.5" />;
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          onClick={toggleTheme}
          className="p-1.5 hover:bg-accent rounded-none border-l border-border pl-4 ml-1 flex items-center justify-center cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Toggle Theme"
          type="button"
          {...props}
        >
          {isDark ? (
            <Sun className="w-5 h-5 pointer-events-none" />
          ) : (
            <Moon className="w-5 h-5 pointer-events-none" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side={isTop ? "bottom" : "top"}
        className="bg-card border border-border text-card-foreground rounded-none"
      >
        {isDark ? "Light Mode" : "Dark Mode"}
      </TooltipContent>
    </Tooltip>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
