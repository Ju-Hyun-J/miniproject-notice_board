# 게시판 프로젝트

간단한 게시판 웹 애플리케이션입니다. 사용자는 닉네임과 내용을 입력하여 게시글을 작성하고, 작성된 게시글 목록을 조회할 수 있습니다.

## 📋 목차

- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [주요 기능](#주요-기능)
- [실행 방법](#실행-방법)
- [API 엔드포인트](#api-엔드포인트)
- [개발 환경 설정](#개발-환경-설정)
- [배포](#배포)

## 🛠 기술 스택

### Frontend
- **Next.js 16.0.10** - React 기반 프레임워크
- **React 19.2.1** - UI 라이브러리
- **Tailwind CSS 4** - 스타일링
- **JavaScript** - 프로그래밍 언어

### Backend
- **Spring Boot 3.4.12** - Java 웹 프레임워크
- **Java 21** - 프로그래밍 언어
- **Spring Data JPA** - 데이터베이스 ORM
- **Spring Security** - 보안 프레임워크
- **Lombok** - 보일러플레이트 코드 감소

### Database
- **MySQL 8.4** - 관계형 데이터베이스

### DevOps
- **Docker** - 컨테이너화
- **Docker Compose** - 다중 컨테이너 관리

## 📁 프로젝트 구조

```
miniproject/
├── backend/                 # Spring Boot 백엔드
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── org/example/backend/
│   │       │       ├── controller/    # REST API 컨트롤러
│   │       │       ├── entity/         # JPA 엔티티
│   │       │       ├── repository/    # 데이터 접근 계층
│   │       │       └── config/         # 설정 클래스
│   │       └── resources/
│   │           └── application.yml     # 애플리케이션 설정
│   ├── Dockerfile
│   └── build.gradle
│
├── frontend/                # Next.js 프론트엔드
│   ├── pages/               # 페이지 라우터
│   │   ├── index.js         # 게시판 목록 페이지
│   │   └── write.js         # 글 작성 페이지
│   ├── lib/                 # 유틸리티 함수
│   │   ├── boardApi.js      # API 호출 함수
│   │   └── config.js        # 설정 파일
│   ├── app/                 # App Router
│   │   ├── layout.js
│   │   └── globals.css      # 전역 스타일
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml       # Docker Compose 설정
```

## ✨ 주요 기능

### 구현된 기능
- ✅ 게시글 목록 조회
- ✅ 게시글 작성 (닉네임, 내용)
- ✅ 작성일시 표시
- ✅ 반응형 UI 디자인

### 데이터 모델
- **Board** 엔티티
  - `id` (Long) - 게시글 고유 ID
  - `nickname` (String) - 작성자 닉네임
  - `content` (String) - 게시글 내용
  - `createdAt` (LocalDateTime) - 작성일시

## 🚀 실행 방법

### 사전 요구사항
- Docker 및 Docker Compose 설치
- 포트 3000, 8080, 3306 사용 가능

### Docker Compose로 실행 (권장)

1. 프로젝트 루트 디렉토리로 이동
```bash
cd miniproject
```

2. 모든 서비스 빌드 및 실행
```bash
docker compose up -d --build
```

3. 서비스 확인
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8080
- MySQL: localhost:3306

4. 서비스 중지
```bash
docker compose down
```

### 개별 실행 (개발 모드)

#### Backend 실행
```bash
cd backend
./gradlew bootRun
```

#### Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

#### MySQL 실행
```bash
docker run -d \
  --name mysql-container \
  -e MYSQL_DATABASE=board_db \
  -e MYSQL_USER=boarddb \
  -e MYSQL_PASSWORD=1234 \
  -e MYSQL_ROOT_PASSWORD=root1234 \
  -p 3306:3306 \
  mysql:8.4
```

## 📡 API 엔드포인트

### Base URL
```
http://localhost:8080/api/boards
```

### 게시글 목록 조회
```http
GET /api/boards
```

**응답 예시:**
```json
[
  {
    "id": 1,
    "nickname": "사용자1",
    "content": "게시글 내용입니다.",
    "createdAt": "2024-12-17T15:30:00"
  }
]
```

### 게시글 작성
```http
POST /api/boards
Content-Type: application/json
```

**요청 본문:**
```json
{
  "nickname": "사용자1",
  "content": "게시글 내용입니다."
}
```

**응답 예시:**
```json
{
  "id": 1,
  "nickname": "사용자1",
  "content": "게시글 내용입니다.",
  "createdAt": "2024-12-17T15:30:00"
}
```

## ⚙️ 개발 환경 설정

### Backend 설정

**application.yml** (로컬 개발용)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/board_db
    username: boarddb
    password: 1234
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

### Frontend 설정

**환경 변수** (`.env.local` 생성)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### CORS 설정
백엔드에서 프론트엔드 도메인(`http://localhost:3000`)에 대한 CORS를 허용하도록 설정되어 있습니다.

### Security 설정
개발 환경에서는 모든 API 엔드포인트에 대한 인증을 비활성화했습니다.

## 🐳 Docker 설정

### Backend Dockerfile
- Multi-stage build 사용
- Java 21 기반
- Spring Boot JAR 실행

### Frontend Dockerfile
- Multi-stage build 사용
- Node.js 20 Alpine 기반
- Next.js 프로덕션 빌드

### Docker Compose
- MySQL 8.4 컨테이너
- Spring Boot 백엔드 컨테이너
- Next.js 프론트엔드 컨테이너
- 서비스 간 의존성 관리 (healthcheck 포함)

## 📝 데이터베이스

### 연결 정보
- **호스트**: localhost (Docker: db)
- **포트**: 3306
- **데이터베이스**: board_db
- **사용자**: boarddb
- **비밀번호**: 1234

### 테이블 구조
```sql
CREATE TABLE board (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255),
    content TEXT,
    created_at DATETIME
);
```

## 🎨 UI/UX 특징

- 깔끔한 테이블 레이아웃
- 반응형 디자인
- 호버 효과
- 직관적인 폼 디자인
- 에러 메시지 표시
- 로딩 상태 표시

## 🔧 트러블슈팅

### 포트 충돌 문제
로컬에서 MySQL이나 다른 서비스가 실행 중인 경우 포트 충돌이 발생할 수 있습니다.

**해결 방법:**
```bash
# MySQL 서비스 중지 (macOS)
brew services stop mysql@8.0

# 실행 중인 프로세스 확인
lsof -i :3306
lsof -i :3000
lsof -i :8080
```

### 프론트엔드 스타일이 적용되지 않는 경우
```bash
# 프론트엔드 컨테이너 재빌드
docker compose up -d --build frontend
```

---

**참고**: 프로덕션 환경에서는 보안 설정(비밀번호, CORS, Security)을 적절히 구성해야 합니다.

