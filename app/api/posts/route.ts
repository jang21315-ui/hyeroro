import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* ========================================
   게시글 작성
======================================== */

export async function POST(request: Request) {
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

  // 폼 데이터 가져오기
  const formData = await request.formData();

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  // 제목 확인
  if (!title) {
    return NextResponse.json(
      {
        error: "제목을 입력해주세요.",
      },
      {
        status: 400,
      }
    );
  }

  // 내용 확인
  if (!content) {
    return NextResponse.json(
      {
        error: "내용을 입력해주세요.",
      },
      {
        status: 400,
      }
    );
  }

  // 게시글 등록
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      title,
      content,
    })
    .select("id")
    .single();

  if (error) {
    console.error("게시글 작성 오류:", error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "게시글 작성에 실패했습니다.",
      },
      {
        status: 500,
      }
    );
  }

  // 작성한 게시글로 이동
  return NextResponse.redirect(
    new URL(`/board/${post.id}`, request.url),
    303
  );
}

/* ========================================
   게시글 삭제
======================================== */

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