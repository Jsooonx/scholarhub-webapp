'use client';

import { useEffect, useState } from 'react';
import { isPopNavigation } from '@/components/SmoothScroll';

export default function Template({ children }: { children: React.ReactNode }) {
  // On back/forward, skip the enter animation entirely so the page
  // doesn't shift 8px downward during the 380ms transition.
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    if (isPopNavigation()) {
      setSkipAnimation(true);
    }
  }, []);

  return (
    <div className={skipAnimation ? '' : 'animate-page-enter'}>
      {children}
    </div>
  );
}
