"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  commentId: string;
};

export default function CommentDeleteButton({
  commentId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "이 댓글을 삭제하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/comments",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            commentId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "댓글 삭제에 실패했습니다."
        );
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "댓글 삭제 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      style={{
        border: "none",
        background: "none",
        color: "#999",
        cursor: loading
          ? "default"
          : "pointer",
        padding: 0,
        fontSize: "13px",
      }}
    >
      {loading ? "삭제 중..." : "🗑️ 삭제"}
    </button>
  );
}