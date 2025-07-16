'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Newspaper, Rocket } from 'lucide-react';

const SITES = [
  {
    id: 'amironews',
    name: 'Amironews',
    url: 'https://amironews.com/',
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    id: 'studio',
    name: 'Firebase Studio',
    url: 'https://studio.firebase.google.com/studio-6936726665',
    icon: <Rocket className="h-5 w-5" />,
  },
];

export default function Home() {
  const [activeSite, setActiveSite] = useState(SITES[0]);

  return (
    <div className="flex flex-col h-dvh bg-background text-foreground font-body">
      <main className="flex-1 overflow-auto bg-muted/20">
        <div
          key={activeSite.id}
          className="w-full h-full animate-in fade-in-0 duration-500"
        >
          <iframe
            src={activeSite.url}
            title={activeSite.name}
            className="w-full h-full border-0"
          />
        </div>
      </main>
    </div>
  );
}
