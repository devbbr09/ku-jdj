# LUMINA - AI 메이크업 진단 서비스 상세 기획서

## 🎯 프로젝트 개요
**LUMINA**는 AI 기반 맞춤형 메이크업 진단 및 전문가 매칭 플랫폼입니다. 2-30대 여성을 주요 타겟으로 하며, 부드럽고 우아한 브랜드 톤앤매너를 지향합니다.

### 핵심 가치 제안
- **AI 진단**: 개인별 얼굴 특징 분석을 통한 맞춤형 메이크업 피드백
- **전문가 매칭**: 뷰티 유튜버/아티스트와의 1:1 연결 서비스
- **트렌드 탐색**: 최신 메이크업 스타일 및 전문가 포트폴리오 탐색

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: `#FADADD` (연분홍)
- **Secondary**: `#FFFFF0` (아이보리)
- **Accent**: `#FFB6C1` (라이트핑크)
- **Text**: `#2D2D2D` (다크그레이)
- **Background**: `#FEFEFE` (화이트)

### 타이포그래피
- **Heading**: Pretendard Bold, 24px-48px
- **Body**: Pretendard Regular, 16px-18px
- **Caption**: Pretendard Medium, 14px

### 컴포넌트 스타일
- **Border Radius**: 12px (카드), 8px (버튼)
- **Shadow**: `0 4px 20px rgba(250, 218, 221, 0.3)`
- **Spacing**: 8px, 16px, 24px, 32px, 48px

## 🏗️ 기술 스택 상세

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Storage**: Supabase Storage

### AI & External Services
- **Vision Analysis**: Google Cloud Vision API
- **Text Generation**: OpenAI GPT-4
- **Image Processing**: Sharp

### Deployment
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain (TBD)

## 📱 사용자 플로우 상세

### 1. 전문가 탐색 플로우
```
메인 페이지 → 전문가 포트폴리오 탐색 → 상세 프로필 → 매칭 신청
```

**상세 단계:**
1. **메인 진입**: LUMINA 로고와 "나만의 메이크업 AI 진단받기" CTA
2. **트렌드 탐색**: "요즘 트렌드를 둘러보세요" 섹션에서 8개 스타일 카드
3. **스타일 상세**: 카드 클릭 시 전체화면 모달 (90vh)
4. **전문가 매칭**: "전문가와 매칭하기" 버튼으로 연결

### 2. AI 진단 플로우
```
AI 진단 페이지 → 이미지 업로드 → AI 분석 → 결과 확인 → 전문가 매칭
```

**상세 단계:**
1. **이미지 업로드**: 민낯, 메이크업 후, 레퍼런스 사진 (드래그 앤 드롭)
2. **AI 분석**: Google Vision + OpenAI 분석 (로딩 화면)
3. **결과 확인**: 영역별 피드백 (아이, 베이스, 립) + 전문가 팁
4. **전문가 매칭**: "전문가 피드백 받기" 버튼

## 🗂️ 데이터베이스 스키마

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Makeup Styles Table
```sql
CREATE TABLE makeup_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  tags TEXT[],
  youtube_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Experts Table
```sql
CREATE TABLE experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  profile_image_url TEXT,
  portfolio_images TEXT[],
  tags TEXT[],
  experience_years INTEGER,
  price_range VARCHAR(50),
  is_offline_available BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Analysis Results Table
```sql
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  bare_face_image_url TEXT,
  makeup_image_url TEXT,
  reference_image_url TEXT,
  overall_score INTEGER,
  eye_feedback TEXT,
  base_feedback TEXT,
  lip_feedback TEXT,
  expert_tips TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 4단계 개발 계획

### 🚀 Stage 1: 메인 페이지 & 기본 UI 구축
**목표**: 메이크업 스타일 추천 메인 페이지를 로컬에서 실행

#### 상세 작업 목록
- [ ] **프로젝트 초기화**
  - [ ] Next.js 14 프로젝트 생성 (TypeScript, Tailwind, App Router)
  - [ ] 필수 패키지 설치 (Shadcn/ui, Lucide React, Zustand)
  - [ ] 프로젝트 구조 설정

- [ ] **디자인 시스템 구축**
  - [ ] Tailwind CSS 커스텀 설정 (컬러, 폰트, 스페이싱)
  - [ ] Shadcn/ui 컴포넌트 설치 및 설정
  - [ ] 글로벌 스타일 정의 (globals.css)

- [ ] **메인 페이지 레이아웃**
  - [ ] Header 컴포넌트 (LUMINA 로고, 네비게이션)
  - [ ] Hero 섹션 ("나만의 메이크업 AI 진단받기" CTA)
  - [ ] 트렌드 섹션 ("요즘 트렌드를 둘러보세요")
  - [ ] 메이크업 스타일 그리드 (8개 카드)

- [ ] **메이크업 스타일 카드 컴포넌트**
  - [ ] 카드 레이아웃 (이미지, 제목, 태그)
  - [ ] 호버 효과 및 애니메이션
  - [ ] 클릭 이벤트 처리

- [ ] **스타일 상세 모달**
  - [ ] 전체화면 모달 (90vh)
  - [ ] 스타일 설명, 사용 제품, 전문가 정보
  - [ ] 유튜브 링크, 매칭 신청 버튼
  - [ ] 모달 열기/닫기 애니메이션

- [ ] **Mock 데이터 구조**
  - [ ] 메이크업 스타일 데이터 (8종)
  - [ ] 전문가 정보 데이터
  - [ ] TypeScript 타입 정의

- [ ] **반응형 디자인**
  - [ ] 모바일 우선 디자인 (320px-768px)
  - [ ] 태블릿 대응 (768px-1024px)
  - [ ] 데스크톱 대응 (1024px+)

#### Stage 1 파일 구조
```
app/
├── page.tsx                 # 메인 페이지
├── layout.tsx              # 루트 레이아웃
├── globals.css             # 글로벌 스타일
components/
├── ui/                     # Shadcn/ui 컴포넌트
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── input.tsx
├── MakeupStyleCard.tsx     # 메이크업 스타일 카드
├── MakeupDetailModal.tsx   # 스타일 상세 모달
├── Header.tsx              # 헤더 컴포넌트
└── Hero.tsx                # 히어로 섹션
lib/
├── data/
│   ├── makeupStyles.ts     # Mock 메이크업 스타일 데이터
│   └── experts.ts          # Mock 전문가 데이터
└── utils.ts                # 유틸리티 함수
types/
└── index.ts                # TypeScript 타입 정의
```

#### Stage 1 Mock 데이터 예시
```typescript
// makeupStyles.ts
export const makeupStyles = [
  {
    id: "1",
    title: "시크 스모키룩",
    description: "깊고 매력적인 스모키 아이메이크업",
    imageUrl: "/images/smoky-look.jpg",
    tags: ["쿨톤", "스모키", "진한"],
    youtubeUrl: "https://youtube.com/watch?v=example",
    expert: {
      name: "김민아",
      title: "아티스트",
      profileImage: "/images/expert1.jpg"
    }
  },
  // ... 7개 더
];
```

#### 검증 포인트
- [ ] 메인 페이지가 프로토타입과 동일하게 표시되는가?
- [ ] 메이크업 스타일 클릭 시 상세 모달이 올바르게 표시되는가?
- [ ] 모바일에서 UI가 깨지지 않는가?
- [ ] 모든 인터랙션이 부드럽게 작동하는가?

---

### 🌐 Stage 2: Vercel 배포 및 CI/CD 설정
**목표**: Stage 1 결과물을 Vercel에 배포하고 자동 배포 파이프라인 구축

#### 상세 작업 목록
- [ ] **GitHub Repository 설정**
  - [ ] Git 초기화 및 첫 커밋
  - [ ] GitHub Repository 생성 및 연결
  - [ ] .gitignore 설정 (Next.js, 환경변수)

- [ ] **Vercel 배포 설정**
  - [ ] Vercel 계정 연동
  - [ ] 프로젝트 Import 및 설정
  - [ ] 환경 변수 설정 (개발용)
  - [ ] 자동 배포 활성화

- [ ] **성능 최적화**
  - [ ] Next.js 설정 최적화 (next.config.js)
  - [ ] 이미지 최적화 설정
  - [ ] 번들 크기 최적화

- [ ] **SEO 기본 설정**
  - [ ] 메타 태그 설정 (metadata.ts)
  - [ ] 사이트맵 생성 (sitemap.ts)
  - [ ] Open Graph 태그 설정

#### Stage 2 파일 구조
```
next.config.js              # Next.js 설정
package.json                # 빌드 스크립트 최적화
vercel.json                 # Vercel 배포 설정
app/
├── metadata.ts             # SEO 메타데이터
├── sitemap.ts              # 사이트맵 생성
└── robots.txt              # 검색엔진 설정
```

#### 검증 포인트
- [ ] Vercel 배포가 성공적으로 완료되는가?
- [ ] 배포된 사이트가 로컬과 동일하게 작동하는가?
- [ ] 자동 배포가 정상 작동하는가?
- [ ] Lighthouse 점수가 90점 이상인가?

---

### 🎨 Stage 3: 전체 페이지 프론트엔드 구현
**목표**: AI 진단, 결과, 전문가 매칭 등 모든 페이지 프론트엔드 완성

#### 상세 작업 목록
- [ ] **AI 진단 페이지**
  - [ ] 진행 체크리스트 컴포넌트
  - [ ] 이미지 업로드 컴포넌트 (드래그 앤 드롭)
  - [ ] 이미지 미리보기 기능
  - [ ] "AI 분석 시작하기" 버튼

- [ ] **AI 분석 로딩 화면**
  - [ ] 로딩 애니메이션 (스피너, 프로그레스 바)
  - [ ] 단계별 메시지 표시
  - [ ] Mock 분석 진행 상황

- [ ] **AI 분석 결과 페이지**
  - [ ] 전체 점수 표시 (원형 프로그레스)
  - [ ] 영역별 상세 피드백 (아이, 베이스, 립)
  - [ ] 개선점 및 제안사항
  - [ ] 전문가 팁 섹션

- [ ] **전문가 매칭 페이지**
  - [ ] 전문가 프로필 리스트 (그리드 레이아웃)
  - [ ] 필터링 기능 (가격, 평점, 전문 분야)
  - [ ] 매칭 신청 버튼 (UI만)
  - [ ] "준비 중" 메시지 표시

- [ ] **사용자 마이페이지**
  - [ ] 분석 히스토리 리스트
  - [ ] 즐겨찾는 스타일
  - [ ] 매칭 신청 현황

- [ ] **네비게이션 및 라우팅**
  - [ ] 하단 네비게이션 바
  - [ ] 페이지 간 라우팅 설정
  - [ ] 뒤로가기 처리

#### Stage 3 파일 구조
```
app/
├── analyze/
│   ├── page.tsx            # AI 진단 페이지
│   ├── loading.tsx         # 로딩 컴포넌트
│   └── result/
│       └── page.tsx        # 분석 결과 페이지
├── experts/
│   └── page.tsx            # 전문가 매칭 페이지
├── profile/
│   └── page.tsx            # 마이페이지
components/
├── ImageUpload.tsx         # 이미지 업로드
├── LoadingScreen.tsx       # 로딩 화면
├── AnalysisResult.tsx      # 분석 결과
├── ExpertCard.tsx          # 전문가 카드
├── ProgressTracker.tsx     # 진행 체크리스트
└── Navigation.tsx          # 네비게이션
lib/
├── mockAnalysis.ts         # Mock 분석 결과
└── mockExperts.ts          # Mock 전문가 데이터
```

#### 검증 포인트
- [ ] 모든 페이지 간 네비게이션이 원활한가?
- [ ] 이미지 업로드 UI가 직관적이고 사용하기 쉬운가?
- [ ] 로딩 및 결과 화면이 사용자 경험을 해치지 않는가?
- [ ] 모바일에서 모든 페이지가 정상 작동하는가?

---

### 🤖 Stage 4: 백엔드 통합 및 AI 기능 구현
**목표**: 실제 데이터베이스, 인증, AI 분석 기능을 구현하여 완전한 서비스 완성

#### 상세 작업 목록
- [ ] **데이터베이스 설정**
  - [ ] Supabase 프로젝트 생성
  - [ ] Prisma 스키마 정의
  - [ ] 데이터베이스 마이그레이션
  - [ ] 시드 데이터 생성

- [ ] **인증 시스템**
  - [ ] NextAuth.js 설정
  - [ ] 이메일/비밀번호 로그인
  - [ ] 구글/카카오 소셜 로그인
  - [ ] 회원가입 플로우

- [ ] **이미지 업로드 API**
  - [ ] Supabase Storage 연동
  - [ ] 이미지 압축 및 최적화
  - [ ] 파일 검증 및 보안

- [ ] **AI 분석 API**
  - [ ] Google Cloud Vision API 통합
  - [ ] OpenAI GPT API 통합
  - [ ] 분석 결과 저장

- [ ] **전문가 매칭 시스템**
  - [ ] 전문가 등록 시스템
  - [ ] 매칭 신청 처리
  - [ ] 알림 시스템

#### Stage 4 파일 구조
```
app/api/
├── auth/
│   └── [...nextauth]/route.ts
├── upload/
│   └── route.ts
├── analyze/
│   └── route.ts
├── experts/
│   └── route.ts
└── admin/
    └── route.ts
prisma/
├── schema.prisma
└── migrations/
lib/
├── auth.ts                 # NextAuth 설정
├── supabase.ts            # Supabase 클라이언트
├── googleVision.ts        # Google Cloud Vision
├── openai.ts              # OpenAI 클라이언트
└── prisma.ts              # Prisma 클라이언트
middleware.ts               # 인증 미들웨어
```

#### 검증 포인트
- [ ] 사용자 회원가입/로그인이 정상 작동하는가?
- [ ] 이미지 업로드 및 AI 분석이 실제로 작동하는가?
- [ ] Google Cloud Vision으로 얼굴 특징이 정확히 분석되는가?
- [ ] OpenAI로 생성된 피드백이 의미있고 정확한가?
- [ ] 전체 서비스가 MVP 수준으로 완성되었는가?

## 🔧 환경 변수 설정

### 개발 환경 (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google Cloud Vision API
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_KEY_FILE=path_to_service_account_key.json

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Database
DATABASE_URL=your_supabase_database_url
```

### 프로덕션 환경 (Vercel)
- Vercel 대시보드에서 환경 변수 설정
- 각 환경별로 다른 값 사용 (개발/스테이징/프로덕션)

## 📊 성능 목표

### Core Web Vitals
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Lighthouse 점수
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 90

### 모바일 최적화
- **터치 타겟 크기**: 최소 44px
- **폰트 크기**: 최소 16px
- **이미지 최적화**: WebP 포맷 사용
- **번들 크기**: 초기 로드 < 500KB

## 🎨 UI/UX 가이드라인

### 접근성 (Accessibility)
- **키보드 네비게이션**: 모든 인터랙티브 요소 접근 가능
- **스크린 리더**: 적절한 ARIA 라벨 및 시맨틱 HTML
- **색상 대비**: WCAG AA 기준 준수
- **폰트 크기**: 최소 16px, 확대 가능

### 사용자 경험
- **로딩 상태**: 모든 비동기 작업에 로딩 표시
- **에러 처리**: 명확한 에러 메시지 및 복구 방법
- **피드백**: 사용자 액션에 대한 즉각적인 피드백
- **일관성**: 전체 앱에서 일관된 디자인 패턴

## 🔒 보안 고려사항

### 데이터 보호
- **이미지 암호화**: 업로드된 이미지 암호화 저장
- **개인정보 보호**: GDPR 준수
- **API 보안**: Rate limiting 및 인증
- **HTTPS**: 모든 통신 암호화

### 사용자 인증
- **JWT 토큰**: 안전한 세션 관리
- **소셜 로그인**: OAuth 2.0 표준 준수
- **비밀번호**: 해시 암호화 저장
- **세션 관리**: 자동 만료 및 갱신

## 📈 분석 및 모니터링

### 사용자 분석
- **Google Analytics**: 사용자 행동 분석
- **Hotjar**: 사용자 경험 분석
- **A/B 테스트**: 기능 개선을 위한 테스트

### 성능 모니터링
- **Vercel Analytics**: 성능 지표 모니터링
- **Error Tracking**: Sentry 연동
- **Uptime Monitoring**: 서비스 가용성 모니터링

## 🚀 배포 전략

### 개발 환경
- **로컬 개발**: `npm run dev`
- **테스트**: `npm run test`
- **빌드**: `npm run build`

### 스테이징 환경
- **Vercel Preview**: PR별 자동 배포
- **테스트 데이터**: 실제 데이터와 유사한 테스트 데이터
- **성능 테스트**: Lighthouse CI

### 프로덕션 환경
- **자동 배포**: main 브랜치 푸시 시 자동 배포
- **도메인 연결**: 커스텀 도메인 설정
- **CDN**: Vercel Edge Network 활용
- **모니터링**: 실시간 성능 및 에러 모니터링

## 📝 문서화

### 개발 문서
- **README.md**: 프로젝트 개요 및 설치 방법
- **API 문서**: Swagger/OpenAPI 스펙
- **컴포넌트 문서**: Storybook (선택사항)

### 사용자 문서
- **사용자 가이드**: 기능별 사용 방법
- **FAQ**: 자주 묻는 질문
- **고객 지원**: 문의 채널 및 응답 시간

## 🎯 성공 지표 (KPI)

### 사용자 지표
- **월간 활성 사용자 (MAU)**: 1,000명
- **사용자 유지율**: 30일 후 40%
- **세션 지속 시간**: 평균 5분

### 비즈니스 지표
- **AI 분석 완료율**: 80%
- **전문가 매칭 신청률**: 15%
- **사용자 만족도**: 4.5/5.0

### 기술 지표
- **페이지 로드 시간**: < 2초
- **에러율**: < 1%
- **가용성**: 99.9%

---

## 📋 최종 체크리스트

### 개발 완료 체크리스트
- [ ] 모든 기능이 프로덕션 환경에서 정상 작동
- [ ] 보안 검토 완료
- [ ] 성능 최적화 완료
- [ ] SEO 최적화 완료
- [ ] 모바일 최적화 완료
- [ ] 사용자 테스트 완료
- [ ] 문서화 완료
- [ ] 배포 및 도메인 연결 완료

### 품질 보증 체크리스트
- [ ] 코드 리뷰 완료
- [ ] 테스트 케이스 작성 및 실행
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 디바이스 테스트
- [ ] 접근성 테스트
- [ ] 성능 테스트
- [ ] 보안 테스트

이 상세 기획서를 바탕으로 단계별 개발을 진행하겠습니다. 각 단계마다 체크리스트를 확인하며 품질 높은 서비스를 구축해 나가겠습니다.
