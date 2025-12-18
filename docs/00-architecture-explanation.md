# 프로젝트 아키텍처 이해도 설명

## 1. 프로젝트 설계 이해

### 1.1 서비스 목적

**명확한 목적**: 간단한 게시판 웹 애플리케이션

- **핵심 기능**: 사용자가 닉네임과 내용을 입력하여 게시글을 작성하고, 작성된 게시글 목록을 조회할 수 있는 서비스
- **사용자 시나리오**:
  1. 사용자가 게시판 목록 페이지에 접속
  2. 글쓰기 버튼을 클릭하여 새 게시글 작성
  3. 닉네임과 내용을 입력하고 등록
  4. 등록된 게시글이 목록에 표시됨

### 1.2 프론트엔드/백엔드 역할 구분

#### 프론트엔드 (Frontend) - Next.js

**역할**: 사용자 인터페이스와 사용자 경험 담당

**주요 책임**:
1. **UI 렌더링**: 사용자가 보는 화면 구성
   - 목록 페이지 (`pages/index.js`): 게시글을 테이블 형태로 표시
   - 글쓰기 페이지 (`pages/write.js`): 입력 폼 제공

2. **사용자 입력 처리**: 
   ```javascript
   // write.js에서 사용자 입력을 state로 관리
   const [nickname, setNickname] = useState("");
   const [content, setContent] = useState("");
   ```

3. **API 호출**: 백엔드 서버와 통신
   ```javascript
   // lib/boardApi.js - API 호출 함수들
   export async function fetchBoards() {
     const res = await fetch(`${API_BASE_URL}/api/boards`);
     return res.json();
   }
   ```

4. **데이터 표시 및 포맷팅**: 
   ```javascript
   // index.js에서 날짜 포맷팅
   const formatDate = (dateString) => {
     // 날짜를 "2024.12.17 오전 9:30" 형식으로 변환
   };
   ```

5. **에러 처리 및 사용자 피드백**: 
   ```javascript
   // 에러 메시지 표시
   {error ? <div className="bg-red-50...">{error}</div> : null}
   ```

**특징**:
- 클라이언트 사이드 렌더링 (CSR)
- React Hooks를 사용한 상태 관리
- Tailwind CSS로 스타일링

#### 백엔드 (Backend) - Spring Boot

**역할**: 비즈니스 로직과 데이터 관리 담당

**주요 책임**:
1. **REST API 제공**: HTTP 요청 처리
   ```java
   @RestController
   @RequestMapping("/api/boards")
   public class BoardController {
       // GET /api/boards - 목록 조회
       @GetMapping()
       public List<Board> getBoards() {
           return boardRepository.findAll();
       }
       
       // POST /api/boards - 게시글 등록
       @PostMapping
       public Board createBoard(@RequestBody Board board) {
           return boardRepository.save(board);
       }
   }
   ```

2. **데이터베이스 연동**: JPA를 통한 데이터 영속성
   ```java
   @Entity
   @Table(name = "board")
   public class Board {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long id;
       private String nickname;
       private String content;
       private LocalDateTime createdAt;
   }
   ```

3. **비즈니스 로직**: 데이터 검증, 처리 규칙
   - 자동 생성 시간 설정 (`@PrePersist`)
   - 데이터 유효성 검증

4. **CORS 설정**: 프론트엔드와의 통신 허용
   ```java
   // CorsConfig.java에서 프론트엔드 도메인 허용
   ```

**특징**:
- 서버 사이드 로직 처리
- 데이터베이스와의 직접 통신
- RESTful API 설계

#### 역할 구분의 명확성

| 구분 | 프론트엔드 | 백엔드 |
|------|-----------|--------|
| **위치** | 브라우저에서 실행 | 서버에서 실행 |
| **언어** | JavaScript (React) | Java (Spring Boot) |
| **책임** | UI/UX, 사용자 상호작용 | 비즈니스 로직, 데이터 관리 |
| **데이터** | 표시만 담당 | 저장/조회 담당 |
| **통신** | HTTP 요청 보냄 | HTTP 요청 받아 처리 |

---

## 2. 데이터 흐름 이해

### 2.1 게시글 목록 조회 흐름

```
[사용자] → [브라우저] → [프론트엔드] → [백엔드 API] → [데이터베이스]
                                                          ↓
[사용자] ← [브라우저] ← [프론트엔드] ← [백엔드 API] ← [데이터베이스]
```

**상세 단계**:

1. **사용자 액션**: 브라우저에서 `http://localhost:3000` 접속

2. **프론트엔드 초기화** (`pages/index.js`):
   ```javascript
   useEffect(() => {
       fetchBoards()  // 컴포넌트 마운트 시 자동 호출
           .then(data => setBoards(data))
   }, []);
   ```

3. **API 호출** (`lib/boardApi.js`):
   ```javascript
   export async function fetchBoards() {
     const res = await fetch(`${API_BASE_URL}/api/boards`);
     // API_BASE_URL = "http://localhost:8080" (또는 "http://backend:8080" in Docker)
     return res.json();
   }
   ```

4. **HTTP 요청 전송**:
   ```
   GET http://localhost:8080/api/boards
   ```

5. **백엔드 컨트롤러 처리** (`BoardController.java`):
   ```java
   @GetMapping()
   public List<Board> getBoards() {
       return boardRepository.findAll();  // JPA Repository 호출
   }
   ```

6. **데이터베이스 쿼리 실행**:
   ```sql
   SELECT * FROM board ORDER BY id;
   ```

7. **응답 반환**: JSON 배열 형태
   ```json
   [
     {
       "id": 1,
       "nickname": "사용자1",
       "content": "게시글 내용",
       "createdAt": "2024-12-17T15:30:00"
     }
   ]
   ```

8. **프론트엔드 상태 업데이트**:
   ```javascript
   setBoards(data);  // React state 업데이트
   ```

9. **화면 렌더링**:
   ```javascript
   {boards.map(board => (
       <tr>
           <td>{board.nickname}</td>
           <td>{board.content}</td>
           <td>{formatDate(board.createdAt)}</td>
       </tr>
   ))}
   ```

### 2.2 게시글 작성 흐름

```
[사용자 입력] → [프론트엔드 검증] → [API 호출] → [백엔드 처리] → [DB 저장] → [응답] → [화면 이동]
```

**상세 단계**:

1. **사용자 입력** (`pages/write.js`):
   ```javascript
   <input value={nickname} onChange={e => setNickname(e.target.value)} />
   <textarea value={content} onChange={e => setContent(e.target.value)} />
   ```

2. **클라이언트 사이드 검증**:
   ```javascript
   if (!nickname.trim() || !content.trim()) {
       setError("닉네임과 내용을 입력해 주세요.");
       return;
   }
   ```

3. **등록 버튼 클릭**:
   ```javascript
   <button onClick={submit}>등록</button>
   ```

4. **API 호출** (`lib/boardApi.js`):
   ```javascript
   await createBoard({ 
       content: content.trim(), 
       nickname: nickname.trim() 
   });
   ```

5. **HTTP POST 요청**:
   ```javascript
   fetch(`${API_BASE_URL}/api/boards`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ content, nickname })
   })
   ```

6. **백엔드 컨트롤러 처리**:
   ```java
   @PostMapping
   public Board createBoard(@RequestBody Board board) {
       // @RequestBody가 JSON을 Board 객체로 자동 변환
       return boardRepository.save(board);
   }
   ```

7. **엔티티 자동 처리** (`Board.java`):
   ```java
   @PrePersist
   public void prePersist() {
       this.createdAt = LocalDateTime.now();  // 자동으로 생성 시간 설정
   }
   ```

8. **데이터베이스 INSERT**:
   ```sql
   INSERT INTO board (nickname, content, created_at) 
   VALUES ('사용자1', '게시글 내용', '2024-12-17 15:30:00');
   ```

9. **응답 반환**: 저장된 게시글 객체
   ```json
   {
     "id": 1,
     "nickname": "사용자1",
     "content": "게시글 내용",
     "createdAt": "2024-12-17T15:30:00"
   }
   ```

10. **프론트엔드 후처리**:
    ```javascript
    alert("등록 완료");
    router.push("/");  // 목록 페이지로 이동
    ```

### 2.3 데이터 흐름 다이어그램

```
┌─────────────┐
│   사용자    │
└──────┬──────┘
       │ 1. 페이지 접속
       ↓
┌─────────────────┐
│  프론트엔드      │
│  (Next.js)      │
│  - UI 렌더링    │
│  - 상태 관리    │
│  - API 호출     │
└──────┬──────────┘
       │ 2. HTTP 요청
       │ GET /api/boards
       ↓
┌─────────────────┐
│  백엔드         │
│  (Spring Boot)  │
│  - API 처리     │
│  - 비즈니스 로직│
└──────┬──────────┘
       │ 3. 쿼리 실행
       ↓
┌─────────────────┐
│  데이터베이스    │
│  (MySQL)        │
│  - 데이터 저장  │
│  - 데이터 조회  │
└─────────────────┘
```

---

## 3. Docker 이해도

### 3.1 Dockerfile의 역할

**Dockerfile**: 애플리케이션을 컨테이너 이미지로 빌드하기 위한 지시사항 파일

#### Backend Dockerfile 분석

```dockerfile
# 1단계: 빌드 스테이지
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Gradle 파일 복사
COPY gradlew build.gradle settings.gradle /app/
COPY gradle /app/gradle
RUN chmod +x /app/gradlew

# 소스 코드 복사 및 빌드
COPY src /app/src
RUN ./gradlew bootJar --no-daemon  # JAR 파일 생성

# 2단계: 실행 스테이지 (Multi-stage build)
FROM eclipse-temurin:21-jre  # JDK 대신 JRE 사용 (경량화)
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/app.jar  # 빌드된 JAR만 복사
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

**역할**:
1. **환경 설정**: Java 21 런타임 환경 구성
2. **의존성 설치**: Gradle을 통한 라이브러리 다운로드
3. **애플리케이션 빌드**: Spring Boot JAR 파일 생성
4. **최적화**: Multi-stage build로 최종 이미지 크기 감소 (JDK → JRE)
5. **실행 명령**: 컨테이너 시작 시 JAR 파일 실행

**장점**:
- 개발 환경과 동일한 빌드 환경 보장
- 의존성 충돌 방지
- 배포 간소화

#### Frontend Dockerfile 분석

```dockerfile
# 1단계: 빌드 스테이지
FROM node:20-alpine AS build
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json /app/
RUN npm ci  # 정확한 버전으로 설치

# 소스 코드 복사 및 빌드
COPY . /app/
RUN npm run build  # Next.js 프로덕션 빌드

# 2단계: 실행 스테이지
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# 프로덕션 의존성만 설치
COPY --from=build /app/package.json /app/package-lock.json /app/
RUN npm ci --omit=dev  # 개발 의존성 제외

# 빌드된 파일만 복사
COPY --from=build /app/.next /app/.next
COPY --from=build /app/pages /app/pages
COPY --from=build /app/app /app/app
COPY --from=build /app/next.config.mjs /app/next.config.mjs

EXPOSE 3000
CMD ["npm","run","start","--","-p","3000"]
```

**역할**:
1. **빌드 환경**: Node.js 20 Alpine (경량화된 리눅스)
2. **의존성 관리**: `npm ci`로 정확한 버전 설치
3. **프로덕션 빌드**: Next.js 최적화된 빌드 생성
4. **최적화**: 개발 의존성 제외, 빌드된 파일만 복사
5. **실행**: Next.js 프로덕션 서버 시작

**Multi-stage Build의 이점**:
- 최종 이미지 크기 감소 (빌드 도구 제외)
- 보안 강화 (불필요한 도구 제거)
- 빌드 시간 최적화

### 3.2 docker-compose.yml의 역할

**docker-compose.yml**: 여러 컨테이너를 하나의 애플리케이션으로 관리하는 설정 파일

```yaml
services:
  db:              # MySQL 데이터베이스
    image: mysql:8.4
    environment:
      MYSQL_DATABASE: board_db
      MYSQL_USER: boarddb
      MYSQL_PASSWORD: 1234
    ports:
      - "3306:3306"  # 호스트:컨테이너 포트 매핑
    volumes:
      - db_data:/var/lib/mysql  # 데이터 영속성
    healthcheck:    # 컨테이너 상태 확인
      test: ["CMD", "mysqladmin", "ping"]
      interval: 5s

  backend:         # Spring Boot 백엔드
    build:
      context: ./backend  # Dockerfile 위치
    environment:
      DB_HOST: db         # 다른 서비스 참조
      DB_PORT: 3306
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy  # DB가 준비될 때까지 대기

  frontend:        # Next.js 프론트엔드
    build:
      context: ./frontend
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://backend:8080  # 내부 네트워크 통신
    ports:
      - "3000:3000"
    depends_on:
      - backend  # 백엔드가 먼저 시작되어야 함

volumes:
  db_data:  # 영구 저장소
```

**주요 역할**:

1. **서비스 정의**: 3개의 컨테이너 (db, backend, frontend)

2. **의존성 관리**:
   ```yaml
   depends_on:
     db:
       condition: service_healthy
   ```
   - 백엔드는 DB가 준비될 때까지 대기
   - 프론트엔드는 백엔드가 시작된 후 실행

3. **네트워크 통신**:
   - 같은 Docker 네트워크 내에서 서비스 이름으로 통신
   - `DB_HOST: db` → MySQL 컨테이너 참조
   - `NEXT_PUBLIC_API_BASE_URL: http://backend:8080` → 백엔드 컨테이너 참조

4. **환경 변수 관리**:
   - 각 서비스별 환경 변수 설정
   - 설정 파일 없이도 실행 가능

5. **포트 매핑**:
   ```yaml
   ports:
     - "3306:3306"  # 호스트:컨테이너
   ```
   - 호스트 머신의 포트를 컨테이너 포트에 연결

6. **볼륨 관리**:
   ```yaml
   volumes:
     - db_data:/var/lib/mysql
   ```
   - 데이터 영속성 보장 (컨테이너 삭제해도 데이터 유지)

### 3.3 Docker Compose 실행 흐름

```
docker compose up -d --build
         ↓
┌─────────────────────────┐
│ 1. 네트워크 생성         │
│    miniproject_default   │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│ 2. 볼륨 생성             │
│    db_data               │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│ 3. DB 컨테이너 시작      │
│    - MySQL 8.4 실행     │
│    - Healthcheck 대기   │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│ 4. Backend 빌드 및 시작 │
│    - Dockerfile 실행    │
│    - JAR 파일 생성      │
│    - Spring Boot 실행  │
│    - DB 연결 대기       │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│ 5. Frontend 빌드 및 시작│
│    - Dockerfile 실행    │
│    - Next.js 빌드       │
│    - 프로덕션 서버 실행 │
└─────────────────────────┘
```

### 3.4 Docker의 장점 (이 프로젝트에서)

1. **환경 일관성**: 개발/테스트/프로덕션 환경 동일
2. **의존성 격리**: 각 서비스가 독립적인 환경
3. **간편한 실행**: `docker compose up` 한 번으로 전체 시스템 실행
4. **확장성**: 서비스 추가/제거 용이
5. **포트 관리**: 각 서비스가 독립적인 포트 사용

---

## 요약

### 프로젝트 설계
- ✅ **서비스 목적 명확**: 간단한 게시판 애플리케이션
- ✅ **역할 구분 명확**: 프론트엔드(UI/UX) vs 백엔드(비즈니스 로직/데이터)

### 데이터 흐름
- ✅ **전체 흐름 이해**: 사용자 → 프론트엔드 → 백엔드 → DB → 응답
- ✅ **각 단계별 처리**: HTTP 요청/응답, JSON 변환, 상태 관리

### Docker 이해도
- ✅ **Dockerfile 역할**: 애플리케이션을 컨테이너 이미지로 빌드
- ✅ **docker-compose 역할**: 여러 컨테이너를 하나의 애플리케이션으로 관리
- ✅ **Multi-stage build**: 최적화된 이미지 생성
- ✅ **서비스 간 통신**: Docker 네트워크를 통한 내부 통신

