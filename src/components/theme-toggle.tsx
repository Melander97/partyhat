'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme (light theme coming soon)"
      title="Light theme coming in Phase 1"
      className="border-border bg-bg-panel text-text-muted hover:border-accent hover:text-accent rounded-md border px-3 py-2 text-xs transition"
      disabled
    >
      {mounted ? (theme === 'dark' ? '☾ Dark' : '☀ Light') : '☾ Dark'}
    </button>
  );
}
