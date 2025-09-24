// LUMINA TypeScript Types

export interface MakeupStyle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  youtubeUrl?: string;
  expert: Expert;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  description: string;
  profileImage: string;
  portfolioImages: string[];
  tags: string[];
  experienceYears: number;
  priceRange: string;
  isOfflineAvailable: boolean;
  rating: number;
  reviewCount: number;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  bareFaceImageUrl: string;
  makeupImageUrl: string;
  referenceImageUrl: string;
  overallScore: number;
  eyeFeedback: string;
  baseFeedback: string;
  lipFeedback: string;
  expertTips: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// UI Component Props
export interface MakeupStyleCardProps {
  style: MakeupStyle;
  onClick: (style: MakeupStyle) => void;
}

export interface MakeupDetailModalProps {
  style: MakeupStyle | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface HeaderProps {
  onAnalyzeClick: () => void;
}

export interface HeroProps {
  onAnalyzeClick: () => void;
}

// State Management
export interface AppState {
  selectedStyle: MakeupStyle | null;
  isModalOpen: boolean;
  setSelectedStyle: (style: MakeupStyle | null) => void;
  setModalOpen: (isOpen: boolean) => void;
}
