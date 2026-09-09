"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  postId: number;
};

export default function PostDeleteButton({
  postId,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "정말 이 게시글을 삭제하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        "/api/posts/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: postId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ??
            "게시글 삭제에 실패했습니다."
        );

        setDeleting(false);
        return;
      }

      alert("게시글이 삭제되었습니다.");

      router.push("/board");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "삭제 중 오류가 발생했습니다."
      );

      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="post-delete-button"
    >
      {deleting ? "삭제 중..." : "삭제"}
    </button>
  );
}