# LUMINA - AI 메이크업 진단 서비스

LUMINA는 AI 기반 맞춤형 메이크업 진단 및 전문가 매칭 플랫폼입니다. 2-30대 여성을 주요 타겟으로 하며, 부드럽고 우아한 브랜드 톤앤매너를 지향합니다.

## 🎯 프로젝트 개요

### 핵심 기능
- **AI 진단**: 개인별 얼굴 특징 분석을 통한 맞춤형 메이크업 피드백
- **전문가 매칭**: 뷰티 유튜버/아티스트와의 1:1 연결 서비스
- **트렌드 탐색**: 최신 메이크업 스타일 및 전문가 포트폴리오 탐색

### 기술 스택
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **State Management**: Zustand
- **UI Components**: Shadcn/ui, Lucide React
- **Styling**: Tailwind CSS with custom design system

## 🚀 빠른 시작

### 1. 프로젝트 클론 및 이동
```bash
git clone <repository-url>
cd ku-jdj/lumina
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
# 현재 디렉토리가 root(kd-jdj)인 경우, cd lumina 커맨드를 통해 이동 후 아래 명령어 실행
npm run dev
```

### 4. 브라우저에서 확인
개발 서버가 실행되면 브라우저에서 다음 URL로 접속하세요:
- **로컬 URL**: http://localhost:3000
- **네트워크 URL**: http://192.168.0.4:3000 (같은 네트워크의 다른 기기에서 접속 가능)

## 📦 설치된 패키지

### 핵심 프레임워크
- `next@15.5.4` - Next.js 프레임워크
- `react@18.3.1` - React 라이브러리
- `typescript@5.6.3` - TypeScript 지원

### UI 및 스타일링
- `tailwindcss@4.0.0` - CSS 프레임워크
- `@tailwindcss/postcss@4.0.0` - PostCSS 플러그인
- `tailwindcss-animate@1.0.7` - 애니메이션 플러그인
- `lucide-react@0.468.0` - 아이콘 라이브러리

### 상태 관리 및 폼
- `zustand@5.0.2` - 상태 관리
- `react-hook-form@7.54.2` - 폼 관리
- `@hookform/resolvers@3.10.0` - 폼 검증
- `zod@3.24.1` - 스키마 검증

### 유틸리티
- `sharp@0.33.5` - 이미지 최적화
- `class-variance-authority@0.7.1` - CSS 클래스 관리
- `clsx@2.1.1` - 조건부 클래스명
- `tailwind-merge@2.5.4` - Tailwind 클래스 병합

## 🏗️ 프로젝트 구조

```
lumina/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── globals.css        # 글로벌 스타일
│   ├── components/            # React 컴포넌트
│   │   ├── ui/               # Shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── input.tsx
│   │   ├── Header.tsx        # 헤더 컴포넌트
│   │   ├── Hero.tsx          # 히어로 섹션
│   │   ├── MakeupStyleCard.tsx    # 메이크업 스타일 카드
│   │   └── MakeupDetailModal.tsx  # 상세 모달
│   ├── lib/                  # 유틸리티 및 데이터
│   │   ├── data/
│   │   │   └── makeupStyles.ts    # Mock 데이터
│   │   ├── store.ts          # Zustand 스토어
│   │   └── utils.ts          # 유틸리티 함수
│   └── types/                # TypeScript 타입 정의
│       └── index.ts
├── public/                   # 정적 파일
├── tailwind.config.ts        # Tailwind 설정
├── components.json           # Shadcn/ui 설정
└── package.json             # 프로젝트 설정
```

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: `#FADADD` (연분홍)
- **Secondary**: `#FFFFF0` (아이보리)
- **Accent**: `#FFB6C1` (라이트핑크)
- **Text**: `#2D2D2D` (다크그레이)
- **Background**: `#FEFEFE` (화이트)

### 주요 컴포넌트
- **Header**: LUMINA 로고, 네비게이션, AI 진단 CTA
- **Hero**: 메인 헤드라인, 설명, CTA 버튼들
- **Style Cards**: 8개 메이크업 스타일 카드
- **Detail Modal**: 스타일 상세 정보 및 전문가 매칭

## 🛠️ 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅 검사
npm run lint

# 타입 검사
npm run type-check
```

## 📱 반응형 디자인

- **모바일**: 320px - 768px
- **태블릿**: 768px - 1024px
- **데스크톱**: 1024px+

## 🎯 현재 구현된 기능 (Stage 1)

### ✅ 완료된 기능
- [x] 메인 페이지 레이아웃
- [x] 헤더 및 네비게이션
- [x] 히어로 섹션
- [x] 메이크업 스타일 카드 (8개)
- [x] 스타일 상세 모달
- [x] 전문가 정보 표시
- [x] 반응형 디자인
- [x] Mock 데이터 구조

### 🔄 다음 단계 (Stage 2)
- [ ] Vercel 배포 설정
- [ ] CI/CD 파이프라인
- [ ] 환경 변수 설정
- [ ] 성능 최적화

## 🐛 문제 해결

### 일반적인 문제들

1. **포트 충돌**
   ```bash
   # 다른 포트로 실행
   npm run dev -- -p 3001
   ```

2. **의존성 문제**
   ```bash
   # node_modules 삭제 후 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **빌드 오류**
   ```bash
   # 캐시 클리어 후 재빌드
   npm run build
   ```


# 작업 사항 깃 업로드 규칙
- git branch 현재 branch 확인
- main인 경우, git pull (최신 상태 유지)
- (main에서) git checkout -b {브랜치명} e.g. git checkout -b "0922-기능추가"
- 이때 git branch -> 생성한 브랜치로 이동

생성한 브랜치에서 로컬에서 작성후 저장,
- git add .
- git commit -m "어떤 기능 업데이트"
- git push origin {브랜치명} e.g. git push origin 0922-기능추가
