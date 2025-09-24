# LUMINA - AI 메이크업 진단 서비스 개발 Blueprint

## Core Rules
Take a deep breath before you start. Think very deep before you deliver answer.
- Validate the programming error. Validate missing installs and install if needed.
- Retrospect on what user have said, and validate if you met user's expectation.

## Development Environment & Stack
- **Framework**: Next.js 14 + TypeScript (풀스택 개발)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Authentication**: NextAuth.js (이메일/소셜 로그인)
- **File Storage**: Supabase Storage (이미지 업로드)
- **AI Integration**: OpenAI GPT-4 Vision API
- **Hosting**: Vercel (자동 배포)
- **State Management**: Zustand (간단한 전역 상태)

## Project Configuration
```bash
# 프로젝트 초기화
npx create-next-app@latest lumina --typescript --tailwind --app

# 핵심 패키지 설치
npm install @supabase/supabase-js
npm install prisma @prisma/client
npm install next-auth
npm install @google-cloud/vision
npm install openai ai
npm install zustand
npm install @hookform/resolvers react-hook-form zod
npm install sharp
npm install lucide-react
```

## Environment Variables (.env.local)
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

# OpenAI (보조적 텍스트 생성용)
OPENAI_API_KEY=your_openai_api_key

# Vercel (배포 시 자동 설정)
```

## Development Guidelines
- blueprint.md를 만들고 개발단계마다 체크박스에 체크하며 개발해
- blueprint.md는 AI를 통해 내용을 보충하고 디테일을 추가한 기획서
- 개발을 위해 console.log를 많이 활용해 디버깅을 원활히 해
- TypeScript 타입 안전성을 최대한 활용해
- 컴포넌트는 재사용 가능하도록 설계해
- 모바일 우선(Mobile-First) 반응형 디자인 적용

## 4-Stage Development Plan

### 🚀 Stage 1: 메인 페이지 & 기본 UI 구축
**목표**: 메이크업 스타일 추천 메인 페이지를 로컬에서 실행

#### Stage 1 Tasks:
- [ ] Next.js 프로젝트 초기화 및 기본 설정
- [ ] Tailwind CSS 및 Shadcn/ui 컴포넌트 라이브러리 설정
- [ ] 메인 페이지 레이아웃 구현
  - [ ] 상단 헤더 (LUMINA 로고)
  - [ ] "나만의 메이크업 AI 진단받기" CTA 버튼
  - [ ] "요즘 트렌드를 둘러보세요" 섹션
  - [ ] 메이크업 스타일 그리드 (8개 스타일)
- [ ] 메이크업 스타일 상세 모달 구현
  - [ ] 전체 화면 모달 (90vh)
  - [ ] 스타일 설명, 사용 제품, 전문가 정보
  - [ ] 유튜브 링크, 매칭 신청 버튼
- [ ] Mock 데이터 구조 설계 및 적용
  - [ ] 메이크업 스타일 데이터 (8종)
  - [ ] 전문가 정보 데이터
- [ ] 반응형 디자인 적용 (모바일 최적화)
- [ ] 로컬 개발 서버 실행 및 테스트

#### Stage 1 Files to Create:
```
app/
├── page.tsx                 # 메인 페이지
├── layout.tsx              # 루트 레이아웃
├── globals.css             # 글로벌 스타일
components/
├── ui/                     # Shadcn/ui 컴포넌트
├── MakeupStyleCard.tsx     # 메이크업 스타일 카드
├── MakeupDetailModal.tsx   # 스타일 상세 모달
├── Header.tsx              # 헤더 컴포넌트
lib/
├── data/                   # Mock 데이터
└── utils.ts               # 유틸리티 함수
types/
└── index.ts               # TypeScript 타입 정의
```

**검증 포인트**: 
- 메인 페이지가 프로토타입과 동일하게 표시되는가?
- 메이크업 스타일 클릭 시 상세 모달이 올바르게 표시되는가?
- 모바일에서 UI가 깨지지 않는가?

---

### 🌐 Stage 2: Vercel 배포 및 CI/CD 설정
**목표**: Stage 1 결과물을 Vercel에 배포하고 자동 배포 파이프라인 구축

#### Stage 2 Tasks:
- [ ] GitHub Repository 생성 및 코드 푸시
- [ ] Vercel 계정 연동 및 프로젝트 생성
- [ ] Vercel 자동 배포 설정
- [ ] 환경 변수 설정 (개발용)
- [ ] 도메인 설정 (선택사항)
- [ ] 배포된 사이트에서 기능 테스트
- [ ] 성능 및 SEO 기본 최적화
  - [ ] 메타 태그 설정
  - [ ] 이미지 최적화
  - [ ] 로딩 속도 최적화

#### Stage 2 Files to Update:
```
next.config.js              # Next.js 설정
package.json                # 빌드 스크립트 최적화
vercel.json                 # Vercel 배포 설정
app/
├── metadata.ts             # SEO 메타데이터
└── sitemap.ts              # 사이트맵 생성
```

**검증 포인트**:
- Vercel 배포가 성공적으로 완료되는가?
- 배포된 사이트가 로컬과 동일하게 작동하는가?
- 자동 배포가 정상 작동하는가?

---

### 🎨 Stage 3: 전체 페이지 프론트엔드 구현
**목표**: AI 진단, 결과, 전문가 매칭 등 모든 페이지 프론트엔드 완성

#### Stage 3 Tasks:
- [ ] AI 진단 페이지 구현
  - [ ] 진행 체크리스트 컴포넌트
  - [ ] 이미지 업로드 컴포넌트 (민낯, 메이크업 후, 레퍼런스)
  - [ ] 드래그 앤 드롭 파일 업로드
  - [ ] 이미지 미리보기 기능
  - [ ] "AI 분석 시작하기" 버튼
- [ ] AI 분석 로딩 화면 구현
  - [ ] 로딩 애니메이션
  - [ ] 진행 상황 표시
  - [ ] 단계별 메시지 ("얼굴 특징 분석 중...", "메이크업 포인트 도출 중...")
- [ ] AI 분석 결과 페이지 구현
  - [ ] 전체 점수 표시
  - [ ] 영역별 상세 피드백 (아이, 베이스, 립)
  - [ ] 개선점 및 제안사항
  - [ ] 전문가 팁 섹션
  - [ ] 재분석 및 전문가 매칭 버튼
- [ ] 전문가 매칭 페이지 구현 (UI만)
  - [ ] 전문가 프로필 리스트
  - [ ] 필터링 기능 (가격, 평점, 전문 분야)
  - [ ] 매칭 신청 버튼 (기능 없이 UI만)
  - [ ] "준비 중" 또는 "곧 출시" 메시지
- [ ] 사용자 마이페이지 구현
  - [ ] 분석 히스토리
  - [ ] 즐겨찾는 스타일
  - [ ] 매칭 신청 현황
- [ ] 네비게이션 및 라우팅 설정
- [ ] 로딩 상태 및 에러 처리 UI
- [ ] 모든 페이지 반응형 디자인 적용

#### Stage 3 Files to Create:
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

**검증 포인트**:
- 모든 페이지 간 네비게이션이 원활한가?
- 이미지 업로드 UI가 직관적이고 사용하기 쉬운가?
- 로딩 및 결과 화면이 사용자 경험을 해치지 않는가?
- 모바일에서 모든 페이지가 정상 작동하는가?

---

### 🤖 Stage 4: 백엔드 통합 및 AI 기능 구현
**목표**: 실제 데이터베이스, 인증, AI 분석 기능을 구현하여 완전한 서비스 완성

#### Stage 4 Tasks:
- [ ] Supabase 프로젝트 설정 및 데이터베이스 스키마 설계
  - [ ] 사용자 테이블 (users)
  - [ ] 메이크업 스타일 테이블 (makeup_styles)
  - [ ] 전문가 테이블 (experts)
  - [ ] 분석 결과 테이블 (analysis_results)
  - [ ] 전문가 테이블 (experts) - 기본 데이터만
- [ ] Prisma ORM 설정 및 마이그레이션
- [ ] NextAuth.js 인증 시스템 구현
  - [ ] 이메일/비밀번호 로그인
  - [ ] 구글/카카오 소셜 로그인
  - [ ] 회원가입 플로우
- [ ] 이미지 업로드 API 구현
  - [ ] Supabase Storage 연동
  - [ ] 이미지 압축 및 최적화
  - [ ] 파일 검증 및 보안
- [ ] Google Cloud Vision API 통합
  - [ ] 얼굴 특징 분석 (얼굴 인식, 랜드마크 검출)
  - [ ] 이미지 품질 검증
  - [ ] 메이크업 포인트 분석
- [ ] OpenAI GPT API 통합 (보조)
  - [ ] Vision API 결과를 바탕으로 텍스트 피드백 생성
  - [ ] 개선점 및 추천사항 생성
  - [ ] 프롬프트 엔지니어링 (메이크업 전문 피드백)
- [ ] 전문가 매칭 UI 구현 (기능 없이)
  - [ ] "전문가 1:1 피드백 받기" 버튼
  - [ ] "서비스 준비 중" 메시지 또는 대기자 등록 폼
- [ ] 관리자 대시보드 구현
  - [ ] 사용자 관리
  - [ ] 전문가 승인 시스템
  - [ ] 분석 통계
- [ ] 보안 및 최적화
  - [ ] Rate limiting
  - [ ] 데이터 암호화
  - [ ] 성능 모니터링
- [ ] 최종 배포 및 도메인 연결

#### Stage 4 Files to Create:
```
app/api/
├── auth/
│   └── [...nextauth]/route.ts
├── upload/
│   └── route.ts
├── analyze/
│   └── route.ts
├── experts/
│   └── route.ts            # 기본 전문가 데이터만
└── admin/
    └── route.ts
prisma/
├── schema.prisma
└── migrations/
lib/
├── auth.ts                 # NextAuth 설정
├── supabase.ts            # Supabase 클라이언트
├── googleVision.ts        # Google Cloud Vision 클라이언트
├── openai.ts              # OpenAI 클라이언트 (텍스트 생성용)
└── prisma.ts              # Prisma 클라이언트
middleware.ts               # 인증 미들웨어
```

**검증 포인트**:
- 사용자 회원가입/로그인이 정상 작동하는가?
- 이미지 업로드 및 AI 분석이 실제로 작동하는가?
- Google Cloud Vision으로 얼굴 특징이 정확히 분석되는가?
- OpenAI로 생성된 피드백이 의미있고 정확한가?
- 전문가 매칭 UI가 "준비 중" 상태로 적절히 표시되는가?
- 전체 서비스가 MVP 수준으로 완성되었는가?

---

## Final Checklist
- [ ] 모든 기능이 프로덕션 환경에서 정상 작동
- [ ] 보안 검토 완료
- [ ] 성능 최적화 완료
- [ ] SEO 최적화 완료
- [ ] 모바일 최적화 완료
- [ ] 사용자 테스트 완료
- [ ] 문서화 완료
- [ ] 배포 및 도메인 연결 완료

## Tech Stack Summary
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **AI**: Google Cloud Vision API + OpenAI GPT API
- **Storage**: Supabase Storage
- **Hosting**: Vercel
- **State Management**: Zustand

## Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Mobile Lighthouse Score**: > 90

## 웹앱 목표
AI 분석과 전문가 매칭을 두 가지 큰 틀로 잡은 뷰티 테크 플랫폼의 구축
- AI 기반 맞춤형 메이크업 진단 및 피드백 제공
- 사용자(메이크업 관심자)와 전문가(뷰티 유튜버/아티스트)의 연결

## 핵심기능 구상
1. 전문가 추천 / 매칭 탭 (메인 화면)
- 전문가들이 포트폴리오 용으로 올린 메이크업 결과물 사진이 피드 형식으로 제시됨. 각 사진에는 짧은 제목 / 스타일 키워드 태그 표시
- 사용자가 사진 클릭 시 → 해당 전문가 상세 팝업으로 이동
- 상세 페이지: 전문가 프로필 제공- 제목, 이름, 소개, 관련 태그(오프라인 시술 예약 가능 여부), 경력, 서비스 가격, 과거 작업물 사진 등 표시(구현되지 않아도 됨)
2. AI 진단 탭
- 사진 업로드: 사용자가 자신의 민낯 / 메이크업 후 / 레퍼런스(목표하는 메이크업) 사진 + 참고한 영상 링크를 탭에서 선택해 진단 창에 업로드
- AI 분석: 얼굴 특징 도출 + 메이크업 전후 사진 차이 분석 + 레퍼런스와 비교
- 결과: AI가 분석 결과를 바탕으로 메이크업의 보완점/개선점에 관한 맞춤형 피드백 제공
- (옵션) 전문가 피드백 유료 요청 → 전문가와 채팅을 통해 업로드된 사진 기반으로 코칭 / 메이크업 예약으로 전문가에게 직접 메이크업 시술도 받을 수 있음. (구현되지 않아도 됨)

## 유저흐름 구상
<전문가 매칭을 원할 때> - 1번 기능만 구현(홈화면 리스트)
1. 앱 접속 → 추천 피드에서 전문가 포트폴리오 탐색
2. 마음에 드는 사진 클릭 → 전문가 상세 프로필 열람
3. 상세 프로필에서 서비스 가격·경력·포트폴리오 확인 → 오프라인 메이크업 예약 / 피드백 요청 가능

<AI 진단을 원할 때> - 1번 기능만 구현, 2번은 비활성화된 버튼만 구현
1. AI 진단 탭 클릭 → 본인 민낯 사진, 메이크업 후 사진, 레퍼런스 사진이나 링크 업로드 후 AI 분석 결과 확인
2. 원할 시 전문가와 매칭 버튼 클릭. 올린 사진을 바탕으로 개선 방향 채팅 피드백 받음 or 오프라인 메이크업 서비스 예약

## 작동규칙
- AI 분석 필수 입력: 민낯 + 메이크업 후 + 레퍼런스 사진
- AI 분석 선택적 입력: 참고한 영상 링크 자막 바탕으로 피드백
- 전문가 등록: 프로필+포트폴리오 사진 등록  / 필수 입력(오프라인 예약 가능 여부) → 피드 자동 반영(오프라인 예약 버튼 활성화 여부는 예약 가능 여부에 따라 결정)
- 메인화면 전문가 프로필 리스트 : 랜덤 소팅, 리뷰 / 좋아요 수 임의로 설정

## 콘텐츠 예시
포트폴리오 카드:
시크 스모키룩
김민아 아티스트
소개: 진한 화장을 전문으로 메이크업을 하고 있는 김민아입니다.
#쿨톤메이크업 #스모키 #진한 #오프라인예약가능
메이크업 상담 버튼 / 메이크업 예약 버튼
전문가 이력: 제8회 한국메이크업미용사회장배 국제미용경진대회 대상 수상
메이크업 가격: 50,000

AI 피드백 예시:
### **아이 메이크업**

**현재:** 아이섀도 발색이 약하고 블렌딩이 부족합니다

**개선점:** 웜톤 브라운 계열의 아이섀도를 사용하여 그라데이션을 더 자연스럽게 연출해보세요. 블렌딩 브러시를 이용해 경계선을 부드럽게 처리하는 것이 중요합니다.

### **베이스 메이크업**

**현재:** 파운데이션 톤이 피부보다 약간 밝은 편입니다

**개선점:** 현재보다 한 톤 어두운 파운데이션을 선택하시면 더 자연스러운 피부 표현이 가능합니다. 목과 얼굴의 경계선도 자연스럽게 블렌딩해주세요.

### **립 메이크업**

**현재:** 입술 색상이 전체적인 메이크업과 잘 어우러집니다

**개선점:** 현재 립 컬러가 매우 잘 어울리네요! 립라이너를 사용하면 더욱 또렷한 입술 라인을 연출할 수 있습니다.

### **전문가 팁**
메이크업 전 충분한 보습은 필수! 프라이머 사용으로 지속력을 높여보세요.
브러시 대신 뷰티블렌더를 사용하면 더 자연스러운 베이스 연출이 가능합니다.
아이섀도 발색을 높이려면 아이섀도 베이스를 먼저 발라주세요.

## 디자인
- 추천 탭 피드 레이아웃: 인스타그램/핀터레스트 스타일의 카드형 그리드
- 전문가 상세 페이지: 위의 대표 카드, 메이크업 결과물 사진들 + 메이크업 타이틀/전문가 이름/메이크업 테마 태그들/전문가 이력/가격/이용자 후기 + 전문가 메이크업 예약, 피드백 상담 버튼
- 예약 페이지: 예약 가능 날짜와 시간대 선택(안 되는 날은 붉은색으로 표시, 되는 날은 검정색) / 예약 버튼 / 결제창 / 결제 완료창
- AI 진단 결과: 전후 이미지 함께 두고 비교+피드백 텍스트 / 사용자와 레퍼런스 메이크업 이미지 함께 두고 비교+피드백 텍스트

전체적인 컬러는 FADADD, FFFFF0 코드로 사용했으면해 (키컬러: 웜톤 아이보리&연분홍)

## 브랜딩
LUMINA라는 서비스명을 사용할거야.
메이크업에 관심이 많은 2-30대 여성을 위주로 타겟하다보니, 부드럽고 제안하는 말투를 사용하도록 해. 다만 우아하고 고급진 느낌도 추가되었으면 해.

