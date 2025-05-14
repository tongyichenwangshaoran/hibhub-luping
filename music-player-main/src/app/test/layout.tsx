"use client";

import { useEffect } from 'react';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Set data-route attribute and apply direct styles for scrolling
  useEffect(() => {
    // Set data-route attribute for CSS targeting
    document.documentElement.setAttribute('data-route', '/test');
    document.body.setAttribute('data-route', '/test');
    
    // Also apply direct styles for maximum compatibility
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100vh';
    
    // Cleanup function to restore original styles when unmounting
    return () => {
      document.documentElement.removeAttribute('data-route');
      document.body.removeAttribute('data-route');
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.minHeight = '';
    };
  }, []);
  
  return (
    <div className="test-page-layout">
      {children}
    </div>
  );
}
