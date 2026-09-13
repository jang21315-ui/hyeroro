"use client";

import { useEffect, useState } from "react";

type LiveVideo = {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  url: string;
};

export default function YouTubeLive() {
  const [liveVideo, setLiveVideo] =
    useState<LiveVideo | null>(null);

  const [loading, setLoading] = useState(true);

  const checkLive = async () => {
    try {
      const response = await fetch(
        "/api/youtube/live",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "YouTube Live API 요청 실패"
        );
      }

      const data = await response.json();

      if (data.live && data.video) {
        setLiveVideo(data.video);
      } else {
        setLiveVideo(null);
      }
    } catch (error) {
      console.error(
        "YouTube Live 불러오기 실패:",
        error
      );

      setLiveVideo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLive();

    // 1분마다 라이브 상태 확인
    const timer = setInterval(() => {
      checkLive();
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // 처음 확인하는 동안
  if (loading) {
    return (
      <div className="youtube-live-box">
        <div className="youtube-live-screen">
          <div className="youtube-live-text">
            라이브 방송을 확인하는 중...
          </div>
        </div>
      </div>
    );
  }

  // 현재 실제 라이브 중
  if (liveVideo) {
    return (
      <div className="youtube-live-box">
        <div className="youtube-live-live-status">
          <span>🔴</span>
          <strong>LIVE NOW</strong>
        </div>

        <div className="youtube-live-player">
          <iframe
            src={`https://www.youtube.com/embed/${liveVideo.id}`}
            title={liveVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className="youtube-live-title">
          {liveVideo.title}
        </div>

        <div className="youtube-live-channel">
          🔴 {liveVideo.channelTitle}
        </div>
      </div>
    );
  }

  // 현재 라이브가 없을 때
  return (
    <div className="youtube-live-box">
      <div className="youtube-live-screen">
        <div className="youtube-live-icon">
          ▶
        </div>

        <div className="youtube-live-text">
          혜로로 LIVE
        </div>

        <div className="youtube-live-sub">
          현재 진행 중인 라이브 방송이 없습니다.
        </div>
      </div>
    </div>
  );
}