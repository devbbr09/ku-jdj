'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, User } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg lumina-gradient">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold lumina-text-gradient">
            LUMINA
          </span>
        </div>

        {/* User Actions - 우측 끝으로 완전 정렬 */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost"
            onClick={() => router.push('/profile')}
            className="flex items-center space-x-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">마이페이지</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
