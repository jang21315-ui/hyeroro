"use client";

import { useEffect, useState } from "react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  url: string;
};

export default function YouTubeShorts() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetch("/api/youtube/shorts");

        if (!response.ok) {
          throw new Error("YouTube API 요청 실패");
        }

        const data = await response.json();

        setVideos(data.videos ?? []);
      } catch (error) {
        console.error(
          "YouTube Shorts 불러오기 실패:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  if (loading) {
    return (
      <div className="youtube-shorts-loading">
        최근 쇼츠를 불러오는 중...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="youtube-shorts-loading">
        등록된 쇼츠가 없습니다.
      </div>
    );
  }

  return (
    <div className="youtube-shorts-wrapper">
      <div className="youtube-shorts-list">

        {videos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="youtube-short-card"
          >

            <div className="youtube-short-image">

              <img
                src={video.thumbnail}
                alt={video.title}
              />

              <div className="youtube-short-badge">
                SHORTS
              </div>

              <div className="youtube-short-play">
                ▶
              </div>

            </div>

            <div className="youtube-short-info">

              <div className="youtube-short-title">
                {video.title}
              </div>

              <div className="youtube-short-channel">
                🔴 혜로로
              </div>

            </div>

          </a>
        ))}

      </div>
    </div>
  );
}