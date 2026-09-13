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

    // 1. 혜로로 유튜브 채널 ID 가져오기
    const channelUrl = new URL(
      "https://www.googleapis.com/youtube/v3/channels"
    );

    channelUrl.searchParams.set("part", "id");
    channelUrl.searchParams.set("forHandle", CHANNEL_HANDLE);
    channelUrl.searchParams.set("key", apiKey);

    const channelResponse = await fetch(
      channelUrl.toString(),
      {
        next: { revalidate: 300 },
      }
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

    const channelId = channelData.items?.[0]?.id;

    if (!channelId) {
      return NextResponse.json(
        {
          error: "HyeroroTV 채널을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // 2. "#shorts"가 포함된 영상만 검색
    //    라이브 방송 / 일반 영상이 섞이는 것을 방지
    const searchUrl = new URL(
      "https://www.googleapis.com/youtube/v3/search"
    );

    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("channelId", channelId);
    searchUrl.searchParams.set("q", "#shorts");
    searchUrl.searchParams.set("order", "date");
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("videoDuration", "short");
    searchUrl.searchParams.set("maxResults", "20");
    searchUrl.searchParams.set("key", apiKey);

    const searchResponse = await fetch(
      searchUrl.toString(),
      {
        next: { revalidate: 300 },
      }
    );

    if (!searchResponse.ok) {
      return NextResponse.json(
        {
          error: "유튜브 쇼츠 조회에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    const searchData = await searchResponse.json();

    const videoIds = (searchData.items ?? [])
      .map((item: any) => item.id?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) {
      return NextResponse.json({
        videos: [],
      });
    }

    // 3. 영상 상세 정보 가져오기
    const videosUrl = new URL(
      "https://www.googleapis.com/youtube/v3/videos"
    );

    videosUrl.searchParams.set("part", "contentDetails,snippet");
    videosUrl.searchParams.set("id", videoIds.join(","));
    videosUrl.searchParams.set("key", apiKey);

    const videosResponse = await fetch(
      videosUrl.toString(),
      {
        next: { revalidate: 300 },
      }
    );

    if (!videosResponse.ok) {
      return NextResponse.json(
        {
          error: "유튜브 쇼츠 상세 정보를 가져오지 못했습니다.",
        },
        { status: 500 }
      );
    }

    const videosData = await videosResponse.json();

    // ISO 8601 영상 길이를 초 단위로 변환
    function getDurationInSeconds(duration: string): number {
      const match = duration.match(
        /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
      );

      if (!match) {
        return 0;
      }

      const hours = Number(match[1] ?? 0);
      const minutes = Number(match[2] ?? 0);
      const seconds = Number(match[3] ?? 0);

      return hours * 3600 + minutes * 60 + seconds;
    }

    // 4. 실제로 쇼츠 후보인 영상만 남김
    const videos = (videosData.items ?? [])
      .filter((item: any) => {
        const duration = getDurationInSeconds(
          item.contentDetails?.duration ?? ""
        );

        const title =
          item.snippet?.title?.toLowerCase() ?? "";

        const description =
          item.snippet?.description?.toLowerCase() ?? "";

        const hasShortsTag =
          title.includes("#shorts") ||
          description.includes("#shorts");

        // 쇼츠는 현재 최대 3분까지 가능
        return duration > 0 && duration <= 180 && hasShortsTag;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(
          a.snippet?.publishedAt ?? 0
        ).getTime();

        const dateB = new Date(
          b.snippet?.publishedAt ?? 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 6)
      .map((item: any) => ({
        id: item.id,

        title:
          item.snippet?.title ?? "제목 없음",

        thumbnail:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          item.snippet?.thumbnails?.default?.url ??
          "",

        publishedAt:
          item.snippet?.publishedAt ?? "",

        channelTitle:
          item.snippet?.channelTitle ??
          "혜로로 YouTube",

        url:
          `https://www.youtube.com/shorts/${item.id}`,
      }));

    return NextResponse.json({
      videos,
    });
  } catch (error) {
    console.error(
      "YouTube Shorts API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "유튜브 쇼츠를 불러오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}