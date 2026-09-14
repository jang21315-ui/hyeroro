import { NextResponse } from "next/server";

type ChannelResponse = {
  items?: {
    id: string;
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }[];
};

type PlaylistItem = {
  contentDetails?: {
    videoId?: string;
  };
};

type PlaylistResponse = {
  items?: PlaylistItem[];
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
      maxres?: {
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

    // 1. 혜로로 유튜브 채널 정보 조회
    const channelResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels" +
        "?part=id,contentDetails" +
        "&forHandle=%40HyeroroTV" +
        "&key=" +
        encodeURIComponent(apiKey),
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!channelResponse.ok) {
      const errorText = await channelResponse.text();

      console.error(
        "YouTube 채널 조회 실패:",
        errorText
      );

      throw new Error("YouTube 채널 조회 실패");
    }

    const channelData =
      (await channelResponse.json()) as ChannelResponse;

    const channel = channelData.items?.[0];

    const channelId = channel?.id;

    const uploadsPlaylistId =
      channel?.contentDetails?.relatedPlaylists?.uploads;

    if (!channelId || !uploadsPlaylistId) {
      return NextResponse.json(
        {
          videos: [],
        },
        { status: 200 }
      );
    }

    // 2. 채널의 업로드 목록 조회
    // search.list를 사용하지 않아 API 할당량을 크게 줄임
    const playlistResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems" +
        "?part=contentDetails" +
        "&playlistId=" +
        encodeURIComponent(uploadsPlaylistId) +
        "&maxResults=50" +
        "&key=" +
        encodeURIComponent(apiKey),
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!playlistResponse.ok) {
      const errorText = await playlistResponse.text();

      console.error(
        "YouTube 업로드 목록 조회 실패:",
        errorText
      );

      throw new Error(
        "YouTube 업로드 목록 조회 실패"
      );
    }

    const playlistData =
      (await playlistResponse.json()) as PlaylistResponse;

    const videoIds =
      playlistData.items
        ?.map(
          (item) =>
            item.contentDetails?.videoId
        )
        .filter(
          (id): id is string =>
            Boolean(id)
        )
        .join(",");

    if (!videoIds) {
      return NextResponse.json(
        {
          videos: [],
        },
        { status: 200 }
      );
    }

    // 3. 영상 상세정보 조회
    const detailsResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/videos" +
        "?part=snippet,contentDetails" +
        "&id=" +
        encodeURIComponent(videoIds) +
        "&key=" +
        encodeURIComponent(apiKey),
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();

      console.error(
        "YouTube 영상 상세정보 조회 실패:",
        errorText
      );

      throw new Error(
        "YouTube 영상 상세정보 조회 실패"
      );
    }

    const detailsData =
      (await detailsResponse.json()) as {
        items?: YouTubeVideoDetail[];
      };

    const videos =
      detailsData.items
        ?.filter((video) => {
          const duration = parseDuration(
            video.contentDetails?.duration ?? ""
          );

          const title =
            video.snippet?.title ?? "";

          const description =
            video.snippet?.description ?? "";

          const text = (
            title +
            " " +
            description
          ).toLowerCase();

          // Shorts 조건
          // 3분 이하이면서 #shorts가 포함된 영상
          return (
            duration > 0 &&
            duration <= 180 &&
            text.includes("#shorts")
          );
        })
        .sort(
          (a, b) =>
            new Date(
              b.snippet.publishedAt
            ).getTime() -
            new Date(
              a.snippet.publishedAt
            ).getTime()
        )
        .slice(0, 6)
        .map((video) => ({
          id: video.id,
          title: video.snippet.title,
          thumbnail:
            video.snippet.thumbnails?.maxres
              ?.url ??
            video.snippet.thumbnails?.high
              ?.url ??
            video.snippet.thumbnails?.medium
              ?.url ??
            "",
          publishedAt:
            video.snippet.publishedAt,
          channelTitle:
            video.snippet.channelTitle,
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