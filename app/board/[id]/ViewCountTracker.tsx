"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  postId: string;
  initialCount: number;
};

export default function ViewCountTracker({
  postId,
  initialCount,
}: Props) {
  const [viewCount, setViewCount] =
    useState(initialCount);

  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) {
      return;
    }

    sent.current = true;

    async function increaseViewCount() {
      try {
        const response = await fetch(
          `/api/posts/${postId}/view`,
          {
            method: "POST",
          }
        );

        const result = await response.json();

        if (
          response.ok &&
          typeof result.viewCount === "number"
        ) {
          setViewCount(result.viewCount);
        }
      } catch (error) {
        console.error(
          "조회수 증가 오류:",
          error
        );
      }
    }

    increaseViewCount();
  }, [postId]);

  return (
    <span>
      👁️ 조회수{" "}
      {viewCount.toLocaleString()}
    </span>
  );
}