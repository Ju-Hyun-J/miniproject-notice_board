import { API_BASE_URL } from "./config";

export async function fetchBoards() {
  const res = await fetch(`${API_BASE_URL}/api/boards`);
  if (!res.ok) {
    throw new Error(`목록 조회 실패: ${res.status}`);
  }
  return res.json();
}

export async function createBoard({ content, nickname }) {
  const res = await fetch(`${API_BASE_URL}/api/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, nickname }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`등록 실패: ${res.status} ${text}`.trim());
  }
  return res.json();
}


