import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          live: false,
          error: "YOUTUBE_API_KEY가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    // 혜로로 유튜브 채널 ID 확인
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
      return NextResponse.json({
        live: false,
        error: "혜로로 유튜브 채널을 찾을 수 없습니다.",
      });
    }

    // 현재 라이브 중인 방송 확인
    const liveResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/search" +
        "?part=snippet" +
        "&channelId=" +
        encodeURIComponent(channelId) +
        "&eventType=live" +
        "&type=video" +
        "&maxResults=1" +
        "&key=" +
        encodeURIComponent(apiKey),
      {
        cache: "no-store",
      }
    );

    if (!liveResponse.ok) {
      throw new Error("YouTube 라이브 조회 실패");
    }

    const liveData = await liveResponse.json();

    const liveItem = liveData.items?.[0];

    if (!liveItem?.id?.videoId) {
      return NextResponse.json({
        live: false,
        video: null,
      });
    }

    const videoId = liveItem.id.videoId;

    return NextResponse.json({
      live: true,
      video: {
        id: videoId,
        title: liveItem.snippet?.title ?? "혜로로 LIVE",
        channelTitle:
          liveItem.snippet?.channelTitle ?? "혜로로",
        thumbnail:
          liveItem.snippet?.thumbnails?.high?.url ??
          liveItem.snippet?.thumbnails?.medium?.url ??
          "",
        url:
          "https://www.youtube.com/watch?v=" +
          videoId,
      },
    });
  } catch (error) {
    console.error("YouTube Live API Error:", error);

    return NextResponse.json(
      {
        live: false,
        error: "YouTube 라이브를 불러오지 못했습니다.",
      },
      { status: 500 }
    );
  }
}