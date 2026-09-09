import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      {
        error: "게시글 ID가 필요합니다.",
      },
      {
        status: 400,
      }
    );
  }

  const supabase = await createClient();

  // 현재 조회수 가져오기
  const { data: post, error: selectError } =
    await supabase
      .from("posts")
      .select("view_count")
      .eq("id", id)
      .single();

  if (selectError || !post) {
    return NextResponse.json(
      {
        error: "게시글을 찾을 수 없습니다.",
      },
      {
        status: 404,
      }
    );
  }

  // 조회수 +1
  const { data: updatedPost, error: updateError } =
    await supabase
      .from("posts")
      .update({
        view_count: post.view_count + 1,
      })
      .eq("id", id)
      .select("view_count")
      .single();

  if (updateError || !updatedPost) {
    console.error(
      "조회수 증가 오류:",
      updateError
    );

    return NextResponse.json(
      {
        error:
          updateError?.message ||
          "조회수 증가에 실패했습니다.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    success: true,
    viewCount: updatedPost.view_count,
  });
}