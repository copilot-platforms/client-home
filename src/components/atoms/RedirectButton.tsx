'use client';

import { ReactNode } from 'react';
import Button from './Button';
import { AvailablePortalRoutes } from '@/types/copilotPortal';

interface RedirectButtonProps {
  route: AvailablePortalRoutes;
  children: string | ReactNode;
  execute: boolean;
}

const RedirectButton = ({ route, children, execute }: RedirectButtonProps) => {
  const handleClick = () => {
    if (execute) {
      window.parent.postMessage({ type: 'history.push', route }, '*');
    }
  };

  return <Button handleClick={handleClick}>{children}</Button>;
};

export default RedirectButton;
