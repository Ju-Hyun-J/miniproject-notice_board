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

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = date.getHours();
        const minute = String(date.getMinutes()).padStart(2, '0');
        const ampm = hour >= 12 ? '오후' : '오전';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        
        return `${year}.${month}.${day} ${ampm} ${displayHour}:${minute}`;
    };

    const styles = {
        container: "min-h-screen bg-gray-50 py-12",
        wrapper: "max-w-5xl mx-auto px-6",
        card: "bg-white rounded-xl shadow-lg p-8",
        header: "flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200",
        title: "text-4xl font-bold text-gray-800",
        btnWrite: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg",
        error: "bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-lg mb-6",
        empty: "text-center py-16 text-gray-500 text-lg",
        table: "w-full border-collapse",
        thead: "bg-gray-100 border-b-2 border-gray-300",
        th: "text-left py-4 px-6 font-semibold text-gray-700",
        tr: "border-b border-gray-200 hover:bg-gray-50 transition",
        td: "py-5 px-6",
        tdNum: "text-gray-600",
        tdNick: "font-medium text-gray-800",
        tdContent: "text-gray-700 leading-relaxed",
        tdDate: "text-sm text-gray-500 whitespace-nowrap"
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>게시판</h1>
                        <Link href="/write" className={styles.btnWrite}>
                            글쓰기
                        </Link>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    {boards.length === 0 ? (
                        <div className={styles.empty}>등록된 글이 없습니다.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.thead}>
                                        <th className={`${styles.th} w-20`}>번호</th>
                                        <th className={`${styles.th} w-40`}>닉네임</th>
                                        <th className={styles.th}>내용</th>
                                        <th className={`${styles.th} w-48`}>작성일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boards.map((board, index) => (
                                        <tr key={board.id} className={styles.tr}>
                                            <td className={`${styles.td} ${styles.tdNum}`}>
                                                {boards.length - index}
                                            </td>
                                            <td className={styles.td}>
                                                <span className={styles.tdNick}>
                                                    {board.nickname || "(닉네임 없음)"}
                                                </span>
                                            </td>
                                            <td className={`${styles.td} ${styles.tdContent}`}>
                                                {board.content}
                                            </td>
                                            <td className={`${styles.td} ${styles.tdDate}`}>
                                                {formatDate(board.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
