import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
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
  const postId = body.postId;

  if (!postId) {
    return NextResponse.json(
      { error: "게시글 ID가 필요합니다." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("post_likes")
    .insert({
      post_id: postId,
      user_id: user.id,
    });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "이미 좋아요를 눌렀습니다." },
        { status: 409 }
      );
    }

    console.error("좋아요 등록 오류:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    liked: true,
  });
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
  const postId = body.postId;

  if (!postId) {
    return NextResponse.json(
      { error: "게시글 ID가 필요합니다." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", user.id);

  if (error) {
    console.error("좋아요 취소 오류:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    liked: false,
  });
}