# API 명세서

## 1. 게시글 목록 조회
| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/boards` |
| **Request Headers** | 없음 |
| **Request Body** | 없음 |
| **Response Status** | `200 OK` |
| **Response Body** | `[{ id, nickname, content, createdAt }, ...]` |

### Response 예시
```json
[
  {
    "id": 1,
    "nickname": "사용자1",
    "content": "게시글 내용입니다.",
    "createdAt": "2024-12-17T15:30:00"
  },
  {
    "id": 2,
    "nickname": "사용자2",
    "content": "두 번째 게시글입니다.",
    "createdAt": "2024-12-17T16:45:00"
  }
]
```

### Response 필드 설명
- `id` (Long): PK
- `nickname` (String): 닉네임
- `content` (String): 내용
- `createdAt` (LocalDateTime): 작성일시

---

## 2. 게시글 등록

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/boards` |
| **Request Headers** | `Content-Type: application/json` |
| **Request Body** | `{ nickname, content }` |
| **Response Status** | `200 OK` |
| **Response Body** | `{ id, nickname, content, createdAt }` |

### Request 예시
```json
{
  "nickname": "사용자1",
  "content": "게시글 내용입니다."
}
```

### Request 필드 설명
- `nickname` (String, 필수): 닉네임
- `content` (String, 필수): 내용

### Response 예시
```json
{
  "id": 1,
  "nickname": "사용자1",
  "content": "게시글 내용입니다.",
  "createdAt": "2024-12-17T15:30:00"
}
```

### Response 필드 설명
- `id` (Long): PK
- `nickname` (String): 입력한 닉네임
- `content` (String): 입력한 내용
- `createdAt` (LocalDateTime): 자동 설정된 작성일시
