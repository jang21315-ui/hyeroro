import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인하지 않은 경우
  if (!user) {
    return NextResponse.redirect(
      new URL("/auth", request.url)
    );
  }

  const formData = await request.formData();

  const postId = formData.get("post_id")?.toString();
  const content = formData.get("content")?.toString();

  // 댓글 내용 확인
  if (!postId || !content?.trim()) {
    return NextResponse.json(
      {
        error: "댓글 내용이 필요합니다.",
      },
      {
        status: 400,
      }
    );
  }

  // 댓글 DB 저장
  const { error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: user.id,
      content: content.trim(),
    });

  if (error) {
    console.error("댓글 등록 오류:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }

  // 등록 후 해당 게시글로 이동
  return NextResponse.redirect(
    new URL(`/board/${postId}`, request.url)
  );
}
export async function DELETE(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const body = await request.json();

  const commentId = body.commentId;

  if (!commentId) {
    return NextResponse.json(
      { error: "댓글 ID가 필요합니다." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("댓글 삭제 오류:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}