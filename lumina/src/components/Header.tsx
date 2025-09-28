'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, User, LogIn } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 인증 상태 확인
    const checkAuth = () => {
      const userToken = localStorage.getItem('user-token') || sessionStorage.getItem('user-session');
      setIsAuthenticated(!!userToken);
    };

    checkAuth();
  }, []);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      alert('마이페이지는 로그인이 필요합니다.\n로그인하시면 분석 히스토리와 즐겨찾기를 저장할 수 있습니다.');
      return;
    }
    router.push('/profile');
  };

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
          {isAuthenticated ? (
            <Button 
              variant="ghost"
              onClick={handleProfileClick}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">마이페이지</span>
            </Button>
          ) : (
            <Button 
              variant="ghost"
              onClick={handleProfileClick}
              className="flex items-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">로그인</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
