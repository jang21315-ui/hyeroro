"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
};

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!isLoggedIn) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      router.push("/auth");
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/likes", {
        method: liked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "좋아요 처리에 실패했습니다."
        );
        return;
      }

      if (result.liked) {
        setLiked(true);
        setCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setCount((prev) =>
          Math.max(0, prev - 1)
        );
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "좋아요 처리 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="btn secondary"
      onClick={handleLike}
      disabled={loading}
      style={{
        cursor: loading
          ? "default"
          : "pointer",
        fontWeight: liked ? "700" : "400",
      }}
    >
      {liked ? "❤️" : "👍"} 좋아요 {count}
    </button>
  );
}