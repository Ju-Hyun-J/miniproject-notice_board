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

    const styles = {
        container: "min-h-screen bg-gray-50 py-12",
        wrapper: "max-w-3xl mx-auto px-6",
        card: "bg-white rounded-xl shadow-lg p-10",
        header: "flex justify-between items-center mb-10 pb-6 border-b-2 border-gray-200",
        title: "text-4xl font-bold text-gray-800",
        linkBack: "text-gray-600 hover:text-gray-800 font-medium transition text-lg",
        error: "bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-lg mb-8",
        form: "space-y-6",
        label: "block text-base font-semibold text-gray-700 mb-3",
        required: "text-red-500",
        input: "w-full px-5 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition",
        textarea: "w-full px-5 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition leading-relaxed",
        actions: "flex justify-end gap-4 pt-6",
        btnCancel: "px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium text-base",
        btnSubmit: "px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg text-base"
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>글 작성</h1>
                        <Link href="/" className={styles.linkBack}>
                            ← 목록으로
                        </Link>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.form}>
                        <div>
                            <label className={styles.label}>
                                닉네임 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="닉네임을 입력하세요"
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                                className={styles.input}
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className={styles.label}>
                                내용 <span className={styles.required}>*</span>
                            </label>
                            <textarea
                                placeholder="내용을 입력하세요"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={12}
                                className={styles.textarea}
                                disabled={submitting}
                            />
                        </div>

                        <div className={styles.actions}>
                            <Link href="/" className={styles.btnCancel}>
                                취소
                            </Link>
                            <button
                                onClick={submit}
                                disabled={submitting}
                                className={styles.btnSubmit}
                            >
                                {submitting ? "등록 중..." : "등록"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
