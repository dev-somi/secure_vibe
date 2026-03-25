# 클린 아키텍처(Clean Architecture) 구조 제안 모음

이 문서는 프로젝트에 클린 아키텍처를 도입할 때 추천하는 기본 폴더 구조와 각 계층의 역할을 자세히 설명하는 가이드입니다.

## 1. 아키텍처 개요

클린 아키텍처의 핵심은 **관심사의 분리(Separation of Concerns)**와 **의존성 규칙(Dependency Rule)**입니다.
모든 의존성은 항상 외부 계층에서 내부 계층(도메인)으로만 향해야 하며, 내부 계층은 외부 계층에 대해 전혀 알지 못해야 합니다.

주로 다음 4가지 계층으로 나뉩니다:
1. **Domain (Entities):** 핵심 비즈니스 로직 및 모델
2. **Application (Use Cases):** 애플리케이션의 구체적인 비즈니스 흐름
3. **Infrastructure (Adapters/Drivers):** 데이터베이스, 외부 API 등 외부 시스템과의 통신
4. **Presentation (UI/Delivery):** 사용자 인터페이스 및 엔드포인트

---

## 2. 추천 폴더 구조 (`src/` 내부)

```text
src/
 ├── domain/             # 1. 핵심 비즈니스 로직 및 엔티티 (가장 독립적인 계층)
 │    ├── entities/      # 비즈니스 모델 데이터 구조 (예: User, Post)
 │    ├── repositories/  # 데이터를 조작하기 위한 인터페이스 (구현체 X)
 │    └── exceptions/    # 도메인 고유의 에러 및 예외 처리
 │
 ├── application/        # 2. 애플리케이션 서비스 (유스케이스)
 │    ├── usecases/      # 실제 비즈니스 흐름을 담당 (예: CreateUser, GetPost)
 │    └── interfaces/    # 외부 서비스 호출을 위한 인터페이스(포트) 정의
 │
 ├── infrastructure/     # 3. 외부 시스템과의 연동 (데이터베이스, 외부 API 등)
 │    ├── api/           # 외부 API 통신 클라이언트 (Axios, Fetch 등)
 │    ├── database/      # DB 연결 및 ORM 설정 (Prisma, TypeORM 등)
 │    ├── repositories/  # domain/repositories 인터페이스의 실제 기술적 구현체
 │    └── services/      # 외부 서비스 (AWS, 이메일 발송 등) 구현체
 │
 ├── presentation/       # 4. 사용자 인터페이스(UI) 또는 엔드포인트
 │    ├── controllers/   # 백엔드의 경우 API 라우터 및 컨트롤러 역할
 │    ├── components/    # 프론트엔드의 경우 공통 UI 컴포넌트
 │    ├── hooks/         # 프론트엔드의 커스텀 훅 (Presentation 로직)
 │    └── views/         # 전체 페이지 레이아웃 및 뷰
 │
 ├── shared/             # (선택 사항) 시스템 전역에서 사용되는 공통 모듈
 │    ├── utils/         # 유틸리티 함수 (날짜 포맷 변경 등)
 │    ├── constants/     # 글로벌 상수 모음
 │    └── types/         # 글로벌 공통 타입 정의
 │
 └── index.ts (또는 main.ts / App.tsx) # 앱의 진입점 (프레임워크 연결, DI 설정 등)
```

---

## 3. 계층별 역할 상세 가이드

### 3.1 Domain 계층
*   **역할:** 프로젝트의 심장에 해당합니다. 상태와 핵심 비즈니스 규칙을 캡슐화합니다.
*   **특징:** 외부 라이브러리, 프레임워크(React, NestJS 등), 데이터베이스에 의존하지 않고 순수한 언어(TypeScript/JavaScript)로만 작성됩니다.
*   **예시:** 사용자의 비밀번호 규칙, 이메일 형식 검증 등 가장 변하지 않는 로직입니다.

### 3.2 Application 계층
*   **역할:** 사용자가 시스템을 통해 수행하려는 특정 작업(Use Case)들을 오케스트레이션합니다.
*   **특징:** 도메인 계층에 정의된 규칙과 모델을 활용하여 비즈니스를 수행합니다. DB에서 데이터를 꺼내고 도메인 모델에 전달한 후 다시 저장하는 일련의 과정을 담당합니다. (예: `UserRegistrationUseCase`)

### 3.3 Infrastructure 계층
*   **역할:** Application과 Domain 계층이 필요로 하는 데이터를 실질적으로 외부(DB, 파일 시스템, API 등)와 주고받습니다.
*   **특징:** Domain 계층에 추상화되어 있는 "저장소(Repository) 인터페이스"를 가져와서, 실제로 DB(예: Prisma, MongoDB)를 조회하는 코드를 작성하는 공간입니다. 외부 의존성이 가장 높은 곳입니다.

### 3.4 Presentation 계층
*   **역할:** 정보를 사용자에게 어떻게 보여줄 것인지, 혹은 사용자의 입력을 어떻게 Application 계층으로 전달할 것인지를 다룹니다.
*   **특징:** React의 컴포넌트나 Next.js의 Pages/App Router가 여기에 해당합니다. 화면을 그리기 위한 상태 관리 모듈(Redux, Zustand 등)도 이곳에서만 관리합니다.

---

## 4. 프레임워크 연동 팁 (Next.js 예시)
*   **Next.js App Router (app 폴더):** app 폴더는 사실상 프레임워크와의 결합이 강하므로 Presentation/Views 계층으로 취급합니다.
*   **DI(Dependency Injection, 의존성 주입):** Clean Architecture에서는 구체적인 구현(Infrastructure)이 추상화(Domain/Application 인터페이스)에 의존하도록 제어의 역전이 필요합니다. 이를 위해 객체 생성 및 조립을 시스템의 가장 바깥이나 진입점에서 해주는 구조(Factory 패턴 등)가 권장됩니다.
