"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { createBoard } from "../lib/boardApi";

export default function Write() {
    const [content, setContent] = useState("");
    const [nickname, setNickname] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const submit = async () => {
        setError("");
        if (!nickname.trim() || !content.trim()) {
            setError("닉네임과 내용을 입력해 주세요.");
            return;
        }
        try {
            setSubmitting(true);
            await createBoard({ content: content.trim(), nickname: nickname.trim() });
            alert("등록 완료");
            router.push("/");
        } catch (e) {
            setError(e?.message ?? "등록 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1>글 작성</h1>
            <div style={{ marginBottom: 12 }}>
                <Link href="/">목록으로</Link>
            </div>
            {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
            <input
                placeholder="닉네임"
                value={nickname}
                onChange={e => setNickname(e.target.value)}/>
            <textarea
                placeholder="내용"
                value={content}
                onChange={e => setContent(e.target.value)}/>

            <button onClick={submit} disabled={submitting}>
                {submitting ? "등록 중..." : "등록"}
            </button>
        </div>
    );
}
