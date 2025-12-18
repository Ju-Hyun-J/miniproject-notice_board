# 프로젝트 설계

## 1. 서비스 설명
(한 문장으로 어떤 문제를 해결하는 서비스인지 작성)
닉네임과 내용을 입력하여 게시글 작성, 작성된 게시글 목록을 조회하는 간단한 게시판 웹 페이지.


## 2. 전체 흐름
(사용자 행동 → 데이터 처리 흐름을 글로 설명)
### 게시글 목록 조회
1. 클라이언트가 메인 페이지에 접속 (로컬 테스트 - http://localhost:3000)
2. useEffect 실행되어 fetchBoards() 호출 후 F.E에서 B.E 로 HTTP 요청 전송 (로컬 테스트 - GET http://localhost:8080/api/boards)
3. B.E 에서 boardRepository.findAll() 메서드 호출 후 DB 조회 (res.json() 으로 리턴되어 있으므로 조회된 데이터 JSON 으로 반환)
4. 받은 데이터를 state 에 저장 후 화면에 표시

### 게시글 작성
1. 메인 페이지에서 '글쓰기' 버튼 클릭하여 글 작성 페이지로 이동 (로컬 테스트 - http://localhost:3000/write)
2. 닉네임과 내용 입력 시 useState 로 상태관리 및 등록 버튼 클릭 시 입력값(닉네임, 내용)이 비어있는지 확인
3. 검증 후 createBoard() 호출하여 POST 해당 요청과 함계 JSON 데이터 B.E 에 전송 (로컬 테스트 - POST http://localhost:8080/api/boards)
4. boardRepository.save(board) 로 요청을 Board 엔티티로 변환 후 DB에 데이터 저장
5. 저장된 게시글을 JSON 형태로 변환 후 라우터로 목록 페이지로 이동


## 3. 프론트엔드 역할
(프론트엔드가 담당하는 책임과 처리 범위)
역할은 UX/UI, React 와 Next.js 기반으로 구현

### 책임
- 인터페이스 렌더링 (화면 구성 및 CSS)
- 클라이언트 입력처리 (Hook 을 통한 상태관리 - useState, useEffect)
- 백엔드 서버와 HTTP 통신 (fetchBoards(), createBoard(), 예외처리)
- 사용자 경험 향상 (라우터를 이용한 페이지 간 이동, 날짜 형식 변환, 상태 표시)

### 기술 스택
- React (16.0.10)
- Next.js (19.2.1)
- Tailwind CSS


## 4. 백엔드 역할
역할은 비지니스 로직과 DB 관리, Spring Boot 와 MySQL 기반으로 구현

### 책임
- REST API 제공 (HTTP 요청 받아 처리 - GET /api/boards, POST /api/boards)
- 비즈니스 로직 처리 (자동 생성 시간 설정, JSON 으로 데이터 변환 및 요청, 응답처리, 예외처리)
- CORS 설정 (F.E 와 통신 및 접근 허용)

### 기술 스택
- Spring Boot (3.4.12)
- Spring Data JPA
- MySQL (8.4)

## 5. 배포 구조 요약
(로컬 환경과 배포 환경의 차이점)