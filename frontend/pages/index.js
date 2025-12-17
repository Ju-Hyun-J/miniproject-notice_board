"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBoards } from "../lib/boardApi";

export default function Home() {
    const [boards, setBoards] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBoards()
            .then(data => setBoards(data))
            .catch(e => setError(e?.message ?? "목록 조회 중 오류가 발생했습니다."));
    }, []);

    return (
        <div>
            <h1>게시판</h1>

            <div style={{ marginBottom: 12 }}>
                <Link href="/write">글쓰기</Link>
            </div>

            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

            <ul>
                {boards.map(board => (
                    <li key={board.id}>
                        <b>{board.nickname ?? "(닉네임 없음)"}</b> - {board.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}
