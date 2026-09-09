import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  const supabase = await createClient();

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "로그인이 필요합니다.",
      },
      {
        status: 401,
      }
    );
  }

  // 삭제할 게시글 ID 가져오기
  const body = await request.json();
  const postId = body.postId;

  if (!postId) {
    return NextResponse.json(
      {
        error: "게시글 ID가 필요합니다.",
      },
      {
        status: 400,
      }
    );
  }

  // 본인이 작성한 게시글만 삭제
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    console.error(
      "게시글 삭제 오류:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "게시글 삭제에 실패했습니다.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    success: true,
  });
}