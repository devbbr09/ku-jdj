import { MakeupStyle } from '@/types';

export const makeupStyles: MakeupStyle[] = [
  {
    id: "1",
    title: "시크 스모키룩",
    description: "깊고 매력적인 스모키 아이메이크업으로 눈을 강조하는 스타일입니다. 쿨톤에 특히 잘 어울리며, 저녁 메이크업으로 완벽합니다.",
    imageUrl: "/images/smoky-look.jpg",
    tags: ["쿨톤", "스모키", "진한", "저녁메이크업"],
    youtubeUrl: "https://youtube.com/watch?v=smoky-tutorial",
    expert: {
      id: "expert1",
      name: "김민아",
      title: "아티스트",
      description: "진한 화장을 전문으로 메이크업을 하고 있는 김민아입니다. 8년간의 경험으로 완벽한 스모키룩을 완성해드립니다.",
      profileImage: "/images/expert1.jpg",
      portfolioImages: ["/images/portfolio1.jpg", "/images/portfolio2.jpg"],
      tags: ["쿨톤메이크업", "스모키", "진한", "오프라인예약가능"],
      experienceYears: 8,
      priceRange: "50,000원",
      isOfflineAvailable: true,
      rating: 4.9,
      reviewCount: 127
    }
  },
  {
    id: "2",
    title: "자연스러운 데일리룩",
    description: "일상에서 착용하기 좋은 자연스러운 메이크업입니다. 웜톤에 특히 잘 어울리며, 직장인 메이크업으로 추천합니다.",
    imageUrl: "/images/daily-look.jpg",
    tags: ["웜톤", "데일리", "자연스러운", "직장인"],
    youtubeUrl: "https://youtube.com/watch?v=daily-tutorial",
    expert: {
      id: "expert2",
      name: "박서연",
      title: "뷰티 유튜버",
      description: "자연스러운 메이크업의 전문가 박서연입니다. 5년간의 경험으로 완벽한 데일리룩을 완성해드립니다.",
      profileImage: "/images/expert2.jpg",
      portfolioImages: ["/images/portfolio3.jpg", "/images/portfolio4.jpg"],
      tags: ["웜톤메이크업", "데일리", "자연스러운", "온라인상담"],
      experienceYears: 5,
      priceRange: "30,000원",
      isOfflineAvailable: false,
      rating: 4.8,
      reviewCount: 89
    }
  },
  {
    id: "3",
    title: "로맨틱 핑크룩",
    description: "로맨틱하고 달콤한 핑크 메이크업입니다. 데이트 메이크업으로 완벽하며, 모든 톤에 잘 어울립니다.",
    imageUrl: "/images/pink-look.jpg",
    tags: ["핑크", "로맨틱", "데이트", "모든톤"],
    youtubeUrl: "https://youtube.com/watch?v=pink-tutorial",
    expert: {
      id: "expert3",
      name: "이지은",
      title: "메이크업 아티스트",
      description: "로맨틱 메이크업의 전문가 이지은입니다. 6년간의 경험으로 완벽한 핑크룩을 완성해드립니다.",
      profileImage: "/images/expert3.jpg",
      portfolioImages: ["/images/portfolio5.jpg", "/images/portfolio6.jpg"],
      tags: ["핑크메이크업", "로맨틱", "데이트", "오프라인예약가능"],
      experienceYears: 6,
      priceRange: "45,000원",
      isOfflineAvailable: true,
      rating: 4.7,
      reviewCount: 156
    }
  },
  {
    id: "4",
    title: "글램 메이크업",
    description: "화려하고 반짝이는 글램 메이크업입니다. 파티나 특별한 날에 완벽하며, 쿨톤에 특히 잘 어울립니다.",
    imageUrl: "/images/glam-look.jpg",
    tags: ["글램", "반짝이는", "파티", "쿨톤"],
    youtubeUrl: "https://youtube.com/watch?v=glam-tutorial",
    expert: {
      id: "expert4",
      name: "최유진",
      title: "글램 전문가",
      description: "글램 메이크업의 전문가 최유진입니다. 7년간의 경험으로 완벽한 글램룩을 완성해드립니다.",
      profileImage: "/images/expert4.jpg",
      portfolioImages: ["/images/portfolio7.jpg", "/images/portfolio8.jpg"],
      tags: ["글램메이크업", "반짝이는", "파티", "오프라인예약가능"],
      experienceYears: 7,
      priceRange: "60,000원",
      isOfflineAvailable: true,
      rating: 4.9,
      reviewCount: 203
    }
  },
  {
    id: "5",
    title: "클린 메이크업",
    description: "깔끔하고 세련된 클린 메이크업입니다. 비즈니스 미팅이나 중요한 자리에서 완벽하며, 모든 톤에 잘 어울립니다.",
    imageUrl: "/images/clean-look.jpg",
    tags: ["클린", "세련된", "비즈니스", "모든톤"],
    youtubeUrl: "https://youtube.com/watch?v=clean-tutorial",
    expert: {
      id: "expert5",
      name: "정수진",
      title: "클린 전문가",
      description: "클린 메이크업의 전문가 정수진입니다. 4년간의 경험으로 완벽한 클린룩을 완성해드립니다.",
      profileImage: "/images/expert5.jpg",
      portfolioImages: ["/images/portfolio9.jpg", "/images/portfolio10.jpg"],
      tags: ["클린메이크업", "세련된", "비즈니스", "온라인상담"],
      experienceYears: 4,
      priceRange: "35,000원",
      isOfflineAvailable: false,
      rating: 4.6,
      reviewCount: 78
    }
  },
  {
    id: "6",
    title: "오렌지 웜톤룩",
    description: "따뜻하고 생기있는 오렌지 웜톤 메이크업입니다. 가을 메이크업으로 완벽하며, 웜톤에 특히 잘 어울립니다.",
    imageUrl: "/images/orange-look.jpg",
    tags: ["오렌지", "웜톤", "가을", "생기있는"],
    youtubeUrl: "https://youtube.com/watch?v=orange-tutorial",
    expert: {
      id: "expert6",
      name: "한소영",
      title: "웜톤 전문가",
      description: "웜톤 메이크업의 전문가 한소영입니다. 5년간의 경험으로 완벽한 웜톤룩을 완성해드립니다.",
      profileImage: "/images/expert6.jpg",
      portfolioImages: ["/images/portfolio11.jpg", "/images/portfolio12.jpg"],
      tags: ["웜톤메이크업", "오렌지", "가을", "오프라인예약가능"],
      experienceYears: 5,
      priceRange: "40,000원",
      isOfflineAvailable: true,
      rating: 4.8,
      reviewCount: 134
    }
  },
  {
    id: "7",
    title: "모노톤 메이크업",
    description: "단조롭지만 세련된 모노톤 메이크업입니다. 미니멀 스타일을 좋아하는 분들에게 완벽하며, 모든 톤에 잘 어울립니다.",
    imageUrl: "/images/mono-look.jpg",
    tags: ["모노톤", "미니멀", "세련된", "모든톤"],
    youtubeUrl: "https://youtube.com/watch?v=mono-tutorial",
    expert: {
      id: "expert7",
      name: "김다은",
      title: "미니멀 전문가",
      description: "미니멀 메이크업의 전문가 김다은입니다. 3년간의 경험으로 완벽한 모노톤룩을 완성해드립니다.",
      profileImage: "/images/expert7.jpg",
      portfolioImages: ["/images/portfolio13.jpg", "/images/portfolio14.jpg"],
      tags: ["미니멀메이크업", "모노톤", "세련된", "온라인상담"],
      experienceYears: 3,
      priceRange: "25,000원",
      isOfflineAvailable: false,
      rating: 4.5,
      reviewCount: 67
    }
  },
  {
    id: "8",
    title: "컬러풀 아트룩",
    description: "화려하고 창의적인 컬러풀 메이크업입니다. 아티스트나 창의적인 분들에게 완벽하며, 모든 톤에 잘 어울립니다.",
    imageUrl: "/images/colorful-look.jpg",
    tags: ["컬러풀", "아트", "창의적인", "모든톤"],
    youtubeUrl: "https://youtube.com/watch?v=colorful-tutorial",
    expert: {
      id: "expert8",
      name: "박예린",
      title: "아트 전문가",
      description: "아트 메이크업의 전문가 박예린입니다. 9년간의 경험으로 완벽한 컬러풀룩을 완성해드립니다.",
      profileImage: "/images/expert8.jpg",
      portfolioImages: ["/images/portfolio15.jpg", "/images/portfolio16.jpg"],
      tags: ["아트메이크업", "컬러풀", "창의적인", "오프라인예약가능"],
      experienceYears: 9,
      priceRange: "70,000원",
      isOfflineAvailable: true,
      rating: 4.9,
      reviewCount: 189
    }
  }
];
