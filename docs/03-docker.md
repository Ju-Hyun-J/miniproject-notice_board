# Docker 구성 설명

## 1. Docker를 사용하는 이유
(본인 언어로 설명)
실행환경을 컨테이너로 묶어 개발, 운영을 함에 있어 어디서든 동일한 환경을 보장해주기 위해 사용되는 도구

---

## 2. Backend Dockerfile 설명
(각 명령이 무엇을 의미하는지 줄 단위로 설명)
FROM eclipse-temurin:21-jdk AS build
- Java 21 JDK 이미지를 기반으로 빌드 스테이지 시작, AS build 로 이름을 부여하여 참조할 있게 함

WORKDIR /app
- 컨테이너 내부 작업 디렉토리를 /app 으로 설정

COPY gradlew build.gradle settings.gradle /app/
COPY gradle /app/gradle
- Gradle 빌드에 필요한 파일들을 컨테이너로 복사 (Gradle Wrapper 실행 파일, Gradle 빌드 설정 파일

RUN chmod +x /app/gradlew
- gradlew 파일에 실행 권한 부여

COPY src /app/src
- 소스 코드를 컨테이너로 복사

RUN ./gradlew bootJar --no-daemon
- Gradle을 사용하여 Spring Boot JAR 파일 생성 (데몬 사용 x)

FROM eclipse-temurin:21-jre
- 두 번째 스테이지 시작: 실행용 이미지 (jre - jdk 대신 사용하여 이미지 크기 감소)

WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/app.jar
- 빌드 스테이지에서 생성된 JAR 파일만 복사 (build 에서)


EXPOSE 8080
- 8080 포트를 사용 명시

ENTRYPOINT ["java","-jar","/app/app.jar"]
- 컨테이너 시작 시 실행할 명령어 (jar 파일 실행)

---

## 3. Frontend Dockerfile 설명
(빌드 과정과 실행 과정 설명)
* 빌드 스테이지 *
FROM node:20-alpine AS build
WORKDIR /app
- Node.js 20 alpine 이미지 사용
- 작업 디렉토리 설정 (/app)

COPY package.json package-lock.json /app/
RUN npm ci
- 의존성 파일 먼저 복사 (캐싱 활용)
- `npm ci`: `package-lock.json`에 명시된 정확한 버전으로 설치 (빠르고 안정적)

COPY . /app/
RUN npm run build
- 소스 코드 복사
- Next.js 빌드 실행

* 실행 스테이지 *
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
- 새로운 이미지에서 시작
- 환경 변수 설정

COPY --from=build /app/package.json /app/package-lock.json /app/
RUN npm ci --omit=dev
- 의존성 파일 복사 (build 에서)
- lock 파일 기반으로 프로덕션 의존성만 설치

COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/pages /app/pages
COPY --from=build /app/app /app/app
COPY --from=build /app/lib /app/lib
COPY --from=build /app/next.config.mjs /app/next.config.mjs
COPY --from=build /app/jsconfig.json /app/jsconfig.json
COPY --from=build /app/postcss.config.mjs /app/postcss.config.mjs
- 빌드 스테이지에서 생성된 파일들, 설정 파일들 복사

EXPOSE 3000
CMD ["npm","run","start","--","-p","3000"]
- 3000 포트 사용 명시
- Next.js 서버 시작

---

## 4. docker-compose 역할
(여러 컨테이너를 함께 실행하는 이유)
F.E / B.E / DB 로 3개의 서비스가 서로 의존성을 가지고 있어 같이 실행되어야 함
이로 인해 docker compose up 을 이용하여 한 번에 서비스 실행

포트 매핑
- 3000:3000 : Frontend
- 8080:8080 : Backend
- 3306:3306 : Database (MySQL)