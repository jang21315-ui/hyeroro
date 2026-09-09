import { NextResponse } from "next/server";

const CHANNEL_HANDLE = "@HyeroroTV";

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "YOUTUBE_API_KEY가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    const channelUrl = new URL(
      "https://www.googleapis.com/youtube/v3/channels"
    );

    channelUrl.searchParams.set("part", "id");
    channelUrl.searchParams.set(
      "forHandle",
      CHANNEL_HANDLE
    );
    channelUrl.searchParams.set("key", apiKey);

    const channelResponse = await fetch(
      channelUrl.toString()
    );

    if (!channelResponse.ok) {
      return NextResponse.json(
        {
          error: "유튜브 채널 조회에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    const channelData = await channelResponse.json();

    const channelId =
      channelData.items?.[0]?.id;

    if (!channelId) {
      return NextResponse.json(
        {
          error:
            "HyeroroTV 채널을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    const searchUrl = new URL(
      "https://www.googleapis.com/youtube/v3/search"
    );

    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set(
      "channelId",
      channelId
    );
    searchUrl.searchParams.set(
      "order",
      "date"
    );
    searchUrl.searchParams.set(
      "type",
      "video"
    );
    searchUrl.searchParams.set(
      "maxResults",
      "6"
    );
    searchUrl.searchParams.set(
      "key",
      apiKey
    );

    const searchResponse = await fetch(
      searchUrl.toString()
    );

    if (!searchResponse.ok) {
      return NextResponse.json(
        {
          error:
            "유튜브 영상 조회에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    const searchData =
      await searchResponse.json();

    const videos =
      (searchData.items ?? [])
        .filter(
          (item: any) =>
            item.id?.videoId
        )
        .map((item: any) => ({
          id: item.id.videoId,

          title:
            item.snippet?.title ??
            "제목 없음",

          thumbnail:
            item.snippet?.thumbnails?.high?.url ??
            item.snippet?.thumbnails?.medium?.url ??
            "",

          publishedAt:
            item.snippet?.publishedAt ?? "",

          channelTitle:
            item.snippet?.channelTitle ??
            "혜로로 YouTube",

          url:
            `https://www.youtube.com/shorts/${item.id.videoId}`,
        }));

    return NextResponse.json({
      videos,
    });
  } catch (error) {
    console.error(
      "YouTube API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "유튜브 영상을 불러오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}