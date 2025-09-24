'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onAnalyzeClick: () => void;
}

export default function Header({ onAnalyzeClick }: HeaderProps) {
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

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#trends" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            트렌드
          </a>
          <a href="#experts" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            전문가
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            소개
          </a>
        </nav>

        {/* CTA Button */}
        <Button 
          onClick={onAnalyzeClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full font-medium"
        >
          AI 진단받기
        </Button>
      </div>
    </header>
  );
}
