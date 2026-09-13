import { NextResponse } from "next/server";

type YouTubeVideo = {
  id: {
    videoId: string;
  };
};

type YouTubeVideoDetail = {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    thumbnails?: {
      medium?: {
        url: string;
      };
      high?: {
        url: string;
      };
    };
  };
  contentDetails?: {
    duration: string;
  };
};

function parseDuration(duration: string): number {
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

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "YOUTUBE_API_KEY가 설정되지 않았습니다.",
          videos: [],
        },
        { status: 500 }
      );
    }

    const channelResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels" +
        "?part=id" +
        "&forHandle=%40HyeroroTV" +
        "&key=" +
        encodeURIComponent(apiKey),
      {
        cache: "no-store",
      }
    );

    if (!channelResponse.ok) {
      throw new Error("YouTube 채널 조회 실패");
    }

    const channelData = await channelResponse.json();

    const channelId = channelData.items?.[0]?.id;

    if (!channelId) {
      return NextResponse.json(
        {
          videos: [],
        },
        { status: 200 }
      );
    }

    const searchResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/search" +
        "?part=snippet" +
        "&channelId=" +
        encodeURIComponent(channelId) +
        "&order=date" +
        "&type=video" +
        "&maxResults=20" +
        "&key=" +
        encodeURIComponent(apiKey),
      {
        cache: "no-store",
      }
    );

    if (!searchResponse.ok) {
      throw new Error("YouTube 영상 목록 조회 실패");
    }

    const searchData = await searchResponse.json();

    const videoIds = (
      searchData.items as YouTubeVideo[] | undefined
    )
      ?.map((item) => item.id?.videoId)
      .filter(Boolean)
      .join(",");

    if (!videoIds) {
      return NextResponse.json(
        {
          videos: [],
        },
        { status: 200 }
      );
    }

    const detailsResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/videos" +
        "?part=snippet,contentDetails" +
        "&id=" +
        encodeURIComponent(videoIds) +
        "&key=" +
        encodeURIComponent(apiKey),
      {
        cache: "no-store",
      }
    );

    if (!detailsResponse.ok) {
      throw new Error("YouTube 영상 상세정보 조회 실패");
    }

    const detailsData = await detailsResponse.json();

    const videos =
      (detailsData.items as YouTubeVideoDetail[] | undefined)
        ?.filter((video) => {
          const duration = parseDuration(
            video.contentDetails?.duration ?? ""
          );

          const text = (
            (video.snippet?.title ?? "") +
            " " +
            (video.snippet?.description ?? "")
          ).toLowerCase();

          return duration <= 180 && text.includes("#shorts");
        })
        .sort(
          (a, b) =>
            new Date(b.snippet.publishedAt).getTime() -
            new Date(a.snippet.publishedAt).getTime()
        )
        .slice(0, 6)
        .map((video) => ({
          id: video.id,
          title: video.snippet.title,
          thumbnail:
            video.snippet.thumbnails?.high?.url ??
            video.snippet.thumbnails?.medium?.url ??
            "",
          publishedAt: video.snippet.publishedAt,
          channelTitle: video.snippet.channelTitle,
          url:
            "https://www.youtube.com/shorts/" +
            video.id,
        })) ?? [];

    return NextResponse.json(
      {
        videos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "YouTube Shorts API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "YouTube Shorts를 불러오지 못했습니다.",
        videos: [],
      },
      { status: 500 }
    );
  }
}