import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import YouTubeShorts from "@/components/YouTubeShorts";

type Post = {
  id: number;
  title: string;
  created_at: string;
  view_count: number;
  user_id: string;
};

type Profile = {
  id: string;
  nickname: string;
  minerals: number;
};

export default async function HomePage() {
  const supabase = await createClient();

  /* ========================================
     최근 게시글
  ======================================== */

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, created_at, view_count, user_id")
    .order("created_at", { ascending: false })
    .limit(6);

  /* ========================================
     미네랄 랭킹
  ======================================== */

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nickname, minerals")
    .order("minerals", { ascending: false })
    .limit(5);

  /* ========================================
     오늘 출석자 수
  ======================================== */

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Seoul",
  });

  const { count: attendanceCount } = await supabase
    .from("attendance")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("attendance_date", today);

  const todayAttendanceCount = attendanceCount ?? 0;

  const recentPosts: Post[] = posts ?? [];
  const ranking: Profile[] = profiles ?? [];

  /* ========================================
     게시글 작성자
  ======================================== */

  const userIds = recentPosts.map((post) => post.user_id);

  let postProfiles: Profile[] = [];

  if (userIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, nickname, minerals")
      .in("id", userIds);

    postProfiles = data ?? [];
  }

  const getNickname = (userId: string) => {
    const profile = postProfiles.find(
      (item) => item.id === userId
    );

    return profile?.nickname ?? "익명";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <style>{`

        /* ========================================
           전체
        ======================================== */

        .home {
          width: 100%;
        }

        .home-card {
          background: #0b0f15;
          border: 1px solid #252b34;
          border-radius: 7px;
          overflow: hidden;
        }

        .card-header {
          height: 43px;
          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: #0f141b;
          border-bottom: 1px solid #252b34;
        }

        .card-title {
          margin: 0;

          color: #e9ebee;
          font-size: 13px;
          font-weight: 800;
        }

        .card-more {
          color: #59636f;
          font-size: 9px;
          text-decoration: none;
        }

        .card-more:hover {
          color: #d6a928;
        }


        /* ========================================
           메인 상단 배너
        ======================================== */

        .main-banner {
          position: relative;

          min-height: 150px;

          margin-bottom: 10px;
          padding: 25px 28px;

          display: flex;
          align-items: center;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(214, 169, 40, 0.12),
              transparent 35%
            ),
            linear-gradient(
              110deg,
              #121820,
              #0b0f15
            );

          border: 1px solid #292f38;
          border-radius: 7px;
        }

        .main-banner::after {
          content: "⛏️";

          position: absolute;
          right: 55px;
          top: 12px;

          color: rgba(214, 169, 40, 0.055);
          font-size: 125px;
          line-height: 1;
        }

        .banner-content {
          position: relative;
          z-index: 1;
        }

        .banner-small {
          margin-bottom: 7px;

          color: #d6a928;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .banner-title {
          margin: 0;

          color: #ffffff;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1.2px;
        }

        .banner-text {
          margin: 7px 0 0;

          color: #707985;
          font-size: 10px;
          line-height: 1.6;
        }


        /* ========================================
           방송 공지사항
        ======================================== */

        .broadcast-notice {
          margin-bottom: 10px;

          background:
            linear-gradient(
              110deg,
              #11171f,
              #0b0f15
            );

          border: 1px solid #292f38;
          border-radius: 7px;

          overflow: hidden;
        }

        .broadcast-notice-header {
          height: 43px;

          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: #0f141b;

          border-bottom: 1px solid #252b34;
        }

        .broadcast-notice-title {
          display: flex;
          align-items: center;

          gap: 7px;

          color: #f0f2f5;

          font-size: 13px;
          font-weight: 800;
        }

        .broadcast-notice-status {
          color: #ff4b5c;

          font-size: 8px;
          font-weight: 900;
        }

        .broadcast-notice-list {
          padding: 0 15px;
        }

        .broadcast-notice-item {
          min-height: 43px;

          display: flex;
          align-items: center;

          gap: 8px;

          border-bottom: 1px solid #1c222a;
        }

        .broadcast-notice-item:last-child {
          border-bottom: none;
        }

        .broadcast-notice-badge {
          flex-shrink: 0;

          padding: 4px 6px;

          background: rgba(255, 75, 92, 0.12);

          border: 1px solid rgba(255, 75, 92, 0.2);

          border-radius: 3px;

          color: #ff5868;

          font-size: 7px;
          font-weight: 900;
        }

        .broadcast-notice-text {
          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;

          color: #c5cad0;

          font-size: 9px;
        }

        .broadcast-notice-date {
          margin-left: auto;

          flex-shrink: 0;

          color: #505963;

          font-size: 7px;
        }


        /* ========================================
           메인 3단 구조
        ======================================== */

        .home-layout {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1.15fr)
            minmax(220px, 0.8fr);

          gap: 10px;

          align-items: start;
        }


        /* ========================================
           컬럼
        ======================================== */

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .center-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .right-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }


        /* ========================================
           중앙 빠른 바로가기
        ======================================== */

        .quick-area {
          display: grid;

          grid-template-columns:
            minmax(0, 1.35fr)
            minmax(190px, 0.65fr);

          gap: 10px;
        }

        .quick-links {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 7px;

          padding: 10px;
        }

        .quick-link {
          min-height: 72px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          background: #0d1219;

          border: 1px solid #252c35;
          border-radius: 5px;

          text-decoration: none;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .quick-link:hover {
          transform: translateY(-2px);

          background: #121821;

          border-color: #d6a928;
        }

        .quick-icon {
          margin-bottom: 6px;

          font-size: 19px;
        }

        .quick-name {
          color: #dfe2e6;

          font-size: 8px;
          font-weight: 800;
        }

        .quick-sub {
          margin-top: 3px;

          color: #59636e;

          font-size: 6px;
        }


        /* ========================================
           출석현황
        ======================================== */

        .attendance-box {
          padding: 15px;
        }

        .attendance-top {
          display: flex;

          align-items: center;
          justify-content: space-between;
        }

        .attendance-title {
          color: #dfe2e6;

          font-size: 11px;
          font-weight: 800;
        }

        .attendance-status {
          padding: 4px 6px;

          background: rgba(79, 209, 197, 0.1);

          border: 1px solid rgba(79, 209, 197, 0.2);

          border-radius: 3px;

          color: #4fd1c5;

          font-size: 7px;
          font-weight: 900;
        }

        .attendance-number {
          margin-top: 10px;

          color: #ffffff;

          font-size: 22px;
          font-weight: 900;
        }

        .attendance-number span {
          margin-left: 3px;

          color: #59636e;

          font-size: 8px;
          font-weight: 600;
        }

        .attendance-text {
          margin-top: 4px;

          color: #59636e;

          font-size: 7px;
          line-height: 1.5;
        }

        .attendance-button {
          width: 100%;

          margin-top: 12px;
          padding: 8px 0;

          display: block;

          background: #151b23;

          border: 1px solid #2c343e;
          border-radius: 4px;

          color: #d6a928;

          font-size: 8px;
          font-weight: 800;

          text-align: center;
          text-decoration: none;

          transition:
            background 0.2s,
            border-color 0.2s;
        }

        .attendance-button:hover {
          background: #1c232d;

          border-color: #d6a928;
        }


        /* ========================================
           LIVE 채널
        ======================================== */

        .youtube-live-box {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
        }

        .youtube-live-screen {
          width: 100%;
          aspect-ratio: 16 / 9;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 50% 45%,
              rgba(255, 50, 70, 0.08),
              transparent 45%
            ),
            #070a0e;

          border: 1px solid #252c35;
          border-radius: 5px;

          text-align: center;
        }

        .youtube-live-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 8px;

          background: #ff3344;

          border-radius: 50%;

          color: #ffffff;

          font-size: 15px;

          padding-left: 2px;
        }

        .youtube-live-text {
          color: #f0f2f5;

          font-size: 12px;
          font-weight: 800;
        }

        .youtube-live-sub {
          margin-top: 5px;

          color: #59636e;

          font-size: 8px;
        }


        /* ========================================
           최근 쇼츠
        ======================================== */

        .youtube-shorts-wrapper {
          width: 100%;
          overflow: hidden;
        }

        .youtube-shorts-list {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 8px;

          padding: 10px;
        }

        .youtube-short-card {
          min-width: 0;

          display: block;

          overflow: hidden;

          background: #0d1219;
          border: 1px solid #252c35;
          border-radius: 5px;

          color: inherit;
          text-decoration: none;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .youtube-short-card:hover {
          transform: translateY(-2px);

          background: #111720;

          border-color: #d6a928;
        }

        .youtube-short-image {
          position: relative;

          width: 100%;

          aspect-ratio: 9 / 13;

          overflow: hidden;

          background: #070a0e;
        }

        .youtube-short-image img {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          transition:
            transform 0.25s ease;
        }

        .youtube-short-card:hover
        .youtube-short-image img {
          transform: scale(1.04);
        }

        .youtube-short-badge {
          position: absolute;

          top: 6px;
          left: 6px;

          padding: 3px 5px;

          background: rgba(255, 35, 55, 0.92);

          border-radius: 3px;

          color: #ffffff;

          font-size: 6px;
          font-weight: 900;

          letter-spacing: 0.4px;
        }

        .youtube-short-play {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          transform: translate(-50%, -50%);

          background: rgba(0, 0, 0, 0.68);

          border: 1px solid
            rgba(255, 255, 255, 0.2);

          border-radius: 50%;

          color: #ffffff;

          font-size: 11px;

          padding-left: 1px;
        }

        .youtube-short-info {
          padding: 8px 8px 9px;
        }

        .youtube-short-title {
          height: 28px;

          overflow: hidden;

          display: -webkit-box;

          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;

          color: #dfe2e6;

          font-size: 8px;
          font-weight: 700;

          line-height: 1.55;
        }

        .youtube-short-channel {
          margin-top: 6px;

          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;

          color: #59636e;

          font-size: 7px;
        }

        .youtube-shorts-loading {
          padding: 35px 10px;

          text-align: center;

          color: #59636e;

          font-size: 8px;
        }


        /* ========================================
           공지
        ======================================== */

        .notice-list {
          padding: 0 15px;
        }

        .notice-item {
          min-height: 39px;

          display: flex;
          align-items: center;

          gap: 7px;

          border-bottom: 1px solid #1c222a;
        }

        .notice-item:last-child {
          border-bottom: none;
        }

        .notice-badge {
          flex-shrink: 0;

          padding: 3px 5px;

          background: rgba(214, 169, 40, 0.12);

          color: #d6a928;

          border-radius: 3px;

          font-size: 7px;
          font-weight: 900;
        }

        .notice-text {
          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;

          color: #aeb5bd;

          font-size: 9px;
        }


        /* ========================================
           게시글
        ======================================== */

        .post-list {
          padding: 0 15px;
        }

        .post-item {
          min-height: 49px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          border-bottom: 1px solid #1c222a;

          text-decoration: none;
        }

        .post-item:last-child {
          border-bottom: none;
        }

        .post-main {
          min-width: 0;
          flex: 1;
        }

        .post-title {
          display: block;

          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;

          color: #dfe2e6;

          font-size: 10px;
          font-weight: 600;
        }

        .post-title:hover {
          color: #d6a928;
        }

        .post-meta {
          display: flex;

          gap: 6px;

          margin-top: 4px;

          color: #555f6b;

          font-size: 7px;
        }

        .post-view {
          flex-shrink: 0;

          color: #505963;

          font-size: 7px;
        }


        /* ========================================
           랭킹
        ======================================== */

        .ranking-list {
          padding: 0 15px;
        }

        .ranking-item {
          min-height: 46px;

          display: flex;
          align-items: center;

          gap: 8px;

          border-bottom: 1px solid #1c222a;
        }

        .ranking-item:last-child {
          border-bottom: none;
        }

        .rank {
          width: 20px;

          text-align: center;

          color: #626b76;

          font-size: 10px;
          font-weight: 900;
        }

        .ranking-item:nth-child(1) .rank {
          color: #ffd84d;
        }

        .ranking-item:nth-child(2) .rank {
          color: #cbd1d8;
        }

        .ranking-item:nth-child(3) .rank {
          color: #c9966c;
        }

        .rank-name {
          min-width: 0;
          flex: 1;

          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;

          color: #d9dde2;

          font-size: 9px;
          font-weight: 600;
        }

        .rank-mineral {
          color: #4fd1c5;

          font-size: 8px;
          font-weight: 800;

          white-space: nowrap;
        }


        /* ========================================
           미네랄
        ======================================== */

        .mineral-box {
          padding: 16px;

          background:
            radial-gradient(
              circle at 90% 50%,
              rgba(79, 209, 197, 0.08),
              transparent 38%
            ),
            #0b1016;
        }

        .mineral-label {
          color: #626c77;

          font-size: 8px;
        }

        .mineral-value {
          margin-top: 5px;

          color: #4fd1c5;

          font-size: 19px;
          font-weight: 900;
        }

        .mineral-description {
          margin-top: 5px;

          color: #59636e;

          font-size: 8px;
          line-height: 1.5;
        }


        /* ========================================
           하단 정보
        ======================================== */

        .bottom-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 10px;

          margin-top: 10px;
        }

        .info-box {
          min-height: 85px;

          padding: 15px;

          background: #0b0f15;

          border: 1px solid #252b34;
          border-radius: 7px;
        }

        .info-label {
          color: #626c77;

          font-size: 8px;
          font-weight: 700;
        }

        .info-title {
          margin-top: 7px;

          color: #dfe2e6;

          font-size: 11px;
          font-weight: 800;
        }

        .info-text {
          margin-top: 4px;

          color: #59636e;

          font-size: 8px;
        }


        /* ========================================
           빈 상태
        ======================================== */

        .empty {
          padding: 24px 10px;

          text-align: center;

          color: #59636e;

          font-size: 9px;
        }


        /* ========================================
           반응형
        ======================================== */

        @media (max-width: 1100px) {

          .quick-area {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 950px) {

          .home-layout {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(0, 1fr);
          }

          .right-column {
            grid-column: 1 / -1;

            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }


        @media (max-width: 650px) {

          .main-banner {
            min-height: 135px;

            padding: 22px;
          }

          .banner-title {
            font-size: 24px;
          }

          .main-banner::after {
            right: 15px;

            font-size: 90px;
          }

          .home-layout {
            grid-template-columns: 1fr;
          }

          .right-column {
            grid-column: auto;

            display: flex;
          }

          .quick-links {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .bottom-grid {
            grid-template-columns: 1fr;
          }

          .youtube-shorts-list {
            display: flex;

            overflow-x: auto;

            gap: 8px;

            padding: 10px;

            scrollbar-width: none;
          }

          .youtube-shorts-list::-webkit-scrollbar {
            display: none;
          }

          .youtube-short-card {
            flex: 0 0 125px;
          }

        }

      `}</style>


      <div className="home">


        {/* ========================================
           메인 배너
        ======================================== */}

        <section className="main-banner">

          <div className="banner-content">

            <div className="banner-small">
              HYE RORO COMMUNITY
            </div>

            <h1 className="banner-title">
              ⛏️ 혜로로
            </h1>

            <p className="banner-text">
              함께 이야기하고 즐기는 혜로로 커뮤니티
            </p>

          </div>

        </section>


        {/* ========================================
           방송 공지사항
        ======================================== */}

        <section className="broadcast-notice">

          <div className="broadcast-notice-header">

            <div className="broadcast-notice-title">
              📢 방송 공지사항
            </div>

            <div className="broadcast-notice-status">
              HYE RORO LIVE
            </div>

          </div>

          <div className="broadcast-notice-list">

            <div className="broadcast-notice-item">

              <span className="broadcast-notice-badge">
                방송
              </span>

              <span className="broadcast-notice-text">
                혜로로 방송 일정과 방송 관련 소식을 확인하세요.
              </span>

              <span className="broadcast-notice-date">
                NOW
              </span>

            </div>


            <div className="broadcast-notice-item">

              <span className="broadcast-notice-badge">
                NOTICE
              </span>

              <span className="broadcast-notice-text">
                혜로로 커뮤니티에 오신 것을 환영합니다.
              </span>

              <span className="broadcast-notice-date">
                09.10
              </span>

            </div>


            <div className="broadcast-notice-item">

              <span className="broadcast-notice-badge">
                INFO
              </span>

              <span className="broadcast-notice-text">
                방송 및 커뮤니티 이용 안내를 확인해주세요.
              </span>

              <span className="broadcast-notice-date">
                09.10
              </span>

            </div>

          </div>

        </section>


        {/* ========================================
           3단 메인 구조
        ======================================== */}

        <div className="home-layout">


          {/* ======================================
             왼쪽
          ====================================== */}

          <div className="left-column">


            {/* ======================================
               LIVE 채널
            ====================================== */}

            <section className="home-card">

              <div className="card-header">

                <h2 className="card-title">
                  🔴 LIVE 채널
                </h2>

                <a
                  href="https://www.youtube.com/@HyeroroTV/live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-more"
                >
                  채널 바로가기 →
                </a>

              </div>


              <div className="youtube-live-box">

                <div className="youtube-live-screen">

                  <div className="youtube-live-icon">
                    ▶
                  </div>

                  <div className="youtube-live-text">
                    혜로로 LIVE
                  </div>

                  <div className="youtube-live-sub">
                    유튜브 채널에서 라이브 방송을 확인하세요.
                  </div>

                </div>

              </div>

            </section>


            {/* ======================================
               최근 쇼츠
            ====================================== */}

            <section className="home-card">

              <div className="card-header">

                <h2 className="card-title">
                  🎬 최근 쇼츠
                </h2>

                <a
                  href="https://www.youtube.com/@HyeroroTV/shorts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-more"
                >
                  더보기 →
                </a>

              </div>

              <YouTubeShorts />

            </section>


            {/* ======================================
               공지사항
            ====================================== */}

            <section className="home-card">

              <div className="card-header">

                <h2 className="card-title">
                  📢 공지사항
                </h2>

                <span className="card-more">
                  NOTICE
                </span>

              </div>


              <div className="notice-list">

                <div className="notice-item">

                  <span className="notice-badge">
                    NOTICE
                  </span>

                  <span className="notice-text">
                    혜로로 커뮤니티에 오신 것을 환영합니다.
                  </span>

                </div>


                <div className="notice-item">

                  <span className="notice-badge">
                    GUIDE
                  </span>

                  <span className="notice-text">
                    게시판과 게임을 이용해보세요.
                  </span>

                </div>


                <div className="notice-item">

                  <span className="notice-badge">
                    INFO
                  </span>

                  <span className="notice-text">
                    활동을 통해 미네랄을 모을 수 있습니다.
                  </span>

                </div>

              </div>

            </section>


          </div>


          {/* ======================================
             가운데
          ====================================== */}

          <div className="center-column">


            {/* ======================================
               빠른 바로가기 + 출석현황
            ====================================== */}

            <div className="quick-area">


              {/* 빠른 바로가기 */}

              <section className="home-card">

                <div className="card-header">

                  <h2 className="card-title">
                    ⚡ 빠른 바로가기
                  </h2>

                  <span className="card-more">
                    QUICK MENU
                  </span>

                </div>


                <div className="quick-links">


                  <Link
                    href="/board"
                    className="quick-link"
                  >

                    <span className="quick-icon">
                      💬
                    </span>

                    <span className="quick-name">
                      게시판
                    </span>

                    <span className="quick-sub">
                      COMMUNITY
                    </span>

                  </Link>


                  <Link
                    href="/ranking"
                    className="quick-link"
                  >

                    <span className="quick-icon">
                      🏆
                    </span>

                    <span className="quick-name">
                      랭킹
                    </span>

                    <span className="quick-sub">
                      RANKING
                    </span>

                  </Link>


                  <Link
                    href="/shop"
                    className="quick-link"
                  >

                    <span className="quick-icon">
                      🛒
                    </span>

                    <span className="quick-name">
                      상점
                    </span>

                    <span className="quick-sub">
                      SHOP
                    </span>

                  </Link>


                  <Link
                    href="/games"
                    className="quick-link"
                  >

                    <span className="quick-icon">
                      🎮
                    </span>

                    <span className="quick-name">
                      게임
                    </span>

                    <span className="quick-sub">
                      GAME
                    </span>

                  </Link>


                </div>

              </section>


              {/* 출석현황 */}

              <section className="home-card">

                <div className="card-header">

                  <h2 className="card-title">
                    📅 출석현황
                  </h2>

                  <span className="card-more">
                    TODAY
                  </span>

                </div>


                <div className="attendance-box">

                  <div className="attendance-top">

                    <div className="attendance-title">
                      오늘의 출석
                    </div>

                    <div className="attendance-status">
                      출석 가능
                    </div>

                  </div>


                  <div className="attendance-number">
                    {todayAttendanceCount}
                    <span>
                      명 출석
                    </span>
                  </div>


                  <div className="attendance-text">
                    오늘 출석하고 미네랄을 받아보세요.
                  </div>


                  <Link
                    href="/attendance"
                    className="attendance-button"
                  >
                    출석체크 →
                  </Link>

                </div>

              </section>


            </div>


            {/* ======================================
               최근 게시글
            ====================================== */}

            <section className="home-card">

              <div className="card-header">

                <h2 className="card-title">
                  📰 최근 게시글
                </h2>

                <Link
                  href="/board"
                  className="card-more"
                >
                  더보기 →
                </Link>

              </div>


              <div className="post-list">

                {recentPosts.length === 0 ? (

                  <div className="empty">
                    아직 작성된 게시글이 없습니다.
                  </div>

                ) : (

                  recentPosts.map((post) => (

                    <Link
                      href={`/board/${post.id}`}
                      className="post-item"
                      key={post.id}
                    >

                      <div className="post-main">

                        <span className="post-title">
                          {post.title}
                        </span>

                        <div className="post-meta">

                          <span>
                            {getNickname(post.user_id)}
                          </span>

                          <span>
                            {formatDate(post.created_at)}
                          </span>

                        </div>

                      </div>

                      <span className="post-view">
                        조회 {post.view_count ?? 0}
                      </span>

                    </Link>

                  ))

                )}

              </div>

            </section>


            {/* ======================================
               미네랄 소개
            ====================================== */}

            <section className="home-card mineral-box">

              <div className="mineral-label">
                혜로로 기본 화폐
              </div>

              <div className="mineral-value">
                ⛏️ 미네랄
              </div>

              <div className="mineral-description">
                혜로로 활동에 사용할 수 있는 커뮤니티 화폐입니다.
              </div>

            </section>


            {/* ======================================
               이용 안내
            ====================================== */}

            <section className="home-card">

              <div className="card-header">

                <h2 className="card-title">
                  💡 혜로로 이용 안내
                </h2>

              </div>


              <div
                className="info-box"
                style={{
                  border: "none",
                  borderRadius: 0,
                }}
              >

                <div className="info-title">
                  혜로로에서 함께 즐겨보세요.
                </div>

                <div className="info-text">
                  게시판에서 이야기를 나누고 게임과 상점을 이용할 수 있습니다.
                </div>

              </div>

            </section>

          </div>


          {/* ======================================
             오른쪽
          ====================================== */}

          <div className="right-column">


            {/* ======================================
               미네랄 랭킹
            ====================================== */}

            <section className="home-card">

              <div className="card-header">

                <h2 className="card-title">
                  🏆 미네랄 랭킹
                </h2>

                <Link
                  href="/ranking"
                  className="card-more"
                >
                  전체보기
                </Link>

              </div>


              <div className="ranking-list">

                {ranking.length === 0 ? (

                  <div className="empty">
                    아직 랭킹 정보가 없습니다.
                  </div>

                ) : (

                  ranking.map(
                    (profile, index) => (

                      <div
                        className="ranking-item"
                        key={profile.id}
                      >

                        <span className="rank">
                          {index + 1}
                        </span>

                        <span className="rank-name">
                          {profile.nickname}
                        </span>

                        <span className="rank-mineral">
                          ⛏️{" "}
                          {profile.minerals.toLocaleString()}
                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </section>


            {/* ======================================
               미니게임
            ====================================== */}

            <section className="home-card">

              <div className="card-header">

                <h2 className="card-title">
                  🎮 미니게임
                </h2>

                <Link
                  href="/games"
                  className="card-more"
                >
                  입장 →
                </Link>

              </div>


              <div
                style={{
                  padding: "18px 15px",
                }}
              >

                <div
                  style={{
                    color: "#dfe2e6",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  🎲 주사위 게임
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    color: "#59636e",
                    fontSize: "8px",
                    lineHeight: 1.5,
                  }}
                >
                  가볍게 즐길 수 있는 혜로로 미니게임
                </div>

              </div>

            </section>


            {/* ======================================
               상점
            ====================================== */}

            <section className="home-card">

              <div className="card-header">

                <h2 className="card-title">
                  🛒 미네랄 상점
                </h2>

                <Link
                  href="/shop"
                  className="card-more"
                >
                  입장 →
                </Link>

              </div>


              <div
                style={{
                  padding: "18px 15px",
                }}
              >

                <div
                  style={{
                    color: "#4fd1c5",
                    fontSize: "17px",
                    fontWeight: 900,
                  }}
                >
                  ⛏️ SHOP
                </div>

                <div
                  style={{
                    marginTop: "5px",
                    color: "#59636e",
                    fontSize: "8px",
                  }}
                >
                  미네랄로 다양한 아이템을 만나보세요.
                </div>

              </div>

            </section>


          </div>

        </div>


        {/* ========================================
           하단 3개 박스
        ======================================== */}

        <div className="bottom-grid">


          <div className="info-box">

            <div className="info-label">
              COMMUNITY
            </div>

            <div className="info-title">
              💬 자유롭게 이야기하세요
            </div>

            <div className="info-text">
              혜로로 게시판에서 다양한 이야기를 나눠보세요.
            </div>

          </div>


          <div className="info-box">

            <div className="info-label">
              MINERAL
            </div>

            <div className="info-title">
              ⛏️ 미네랄을 모아보세요
            </div>

            <div className="info-text">
              혜로로의 다양한 콘텐츠에서 미네랄을 활용할 수 있습니다.
            </div>

          </div>


          <div className="info-box">

            <div className="info-label">
              HYE RORO
            </div>

            <div className="info-title">
              🌙 즐거운 커뮤니티
            </div>

            <div className="info-text">
              혜로로에서 편하게 이야기를 나눠보세요.
            </div>

          </div>


        </div>


      </div>
    </>
  );
}