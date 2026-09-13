import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import YouTubeLive from "@/components/YouTubeLive";
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

  // ========================================
  // 최근 게시글
  // ========================================

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, created_at, view_count, user_id")
    .order("created_at", { ascending: false })
    .limit(6);

  // ========================================
  // 미네랄 랭킹
  // ========================================

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nickname, minerals")
    .order("minerals", { ascending: false })
    .limit(5);

  // ========================================
  // 오늘 출석자 수
  // ========================================

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

  // ========================================
  // 데이터 정리
  // ========================================

  const recentPosts: Post[] = posts ?? [];
  const ranking: Profile[] = profiles ?? [];
  const todayAttendanceCount = attendanceCount ?? 0;

  // ========================================
  // 게시글 작성자
  // ========================================

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
    <div className="home">

      <style>{`

        /* ========================================
           기본
        ======================================== */

        .home {
          width: 100%;
          color: #e9edf2;
        }

        .home * {
          box-sizing: border-box;
        }

        .home a {
          text-decoration: none;
        }

        .home-card {
          width: 100%;
          overflow: hidden;
          background: #0b0f15;
          border: 1px solid #242b35;
          border-radius: 8px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          min-height: 44px;
          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: #10151c;
          border-bottom: 1px solid #232a33;
        }

        .card-title {
          margin: 0;

          color: #edf0f3;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -0.2px;
        }

        .card-more {
          color: #626c78;
          font-size: 9px;
          font-weight: 700;

          transition: color 0.2s ease;
        }

        .card-more:hover {
          color: #d6a928;
        }


        /* ========================================
           히어로
        ======================================== */

        .hero {
          position: relative;

          min-height: 190px;
          margin-bottom: 10px;
          padding: 30px;

          display: flex;
          align-items: center;

          overflow: hidden;

          background:
            radial-gradient(
              circle at 82% 50%,
              rgba(214, 169, 40, 0.16),
              transparent 32%
            ),
            radial-gradient(
              circle at 65% 0%,
              rgba(79, 209, 197, 0.06),
              transparent 35%
            ),
            linear-gradient(
              120deg,
              #151c25,
              #0b0f15 70%
            );

          border: 1px solid #2b333d;
          border-radius: 8px;
        }

        .hero::before {
          content: "";

          position: absolute;

          width: 260px;
          height: 260px;

          right: -100px;
          top: -90px;

          border: 1px solid rgba(214, 169, 40, 0.08);
          border-radius: 50%;
        }

        .hero::after {
          content: "⛏️";

          position: absolute;

          right: 42px;
          top: 17px;

          color: rgba(214, 169, 40, 0.07);

          font-size: 125px;
          line-height: 1;

          transform: rotate(-8deg);
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-label {
          margin-bottom: 8px;

          color: #d6a928;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .hero-title {
          margin: 0;

          color: #ffffff;

          font-size: 32px;
          font-weight: 950;
          letter-spacing: -1.5px;
        }

        .hero-title span {
          color: #d6a928;
        }

        .hero-description {
          margin: 9px 0 0;

          color: #737d89;

          font-size: 10px;
          line-height: 1.7;
        }

        .hero-buttons {
          margin-top: 16px;

          display: flex;
          gap: 7px;
        }

        .hero-button {
          padding: 8px 12px;

          border-radius: 4px;

          font-size: 8px;
          font-weight: 800;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .hero-button:hover {
          transform: translateY(-1px);
        }

        .hero-button.primary {
          background: #d6a928;
          border: 1px solid #d6a928;

          color: #15120a;
        }

        .hero-button.primary:hover {
          background: #e7bc3d;
        }

        .hero-button.secondary {
          background: rgba(255,255,255,0.025);
          border: 1px solid #343d48;

          color: #cbd1d8;
        }

        .hero-button.secondary:hover {
          border-color: #d6a928;
        }


        /* ========================================
           3단 레이아웃
        ======================================== */

        .home-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1.35fr)
            minmax(220px, 0.8fr);

          gap: 10px;

          align-items: start;
        }

        .home-column {
          display: flex;
          flex-direction: column;

          gap: 10px;

          min-width: 0;
        }


        /* ========================================
           LIVE
        ======================================== */

        .youtube-live-box {
          width: 100%;
          padding: 10px;
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

        .youtube-live-live-status {
          display: flex;
          align-items: center;

          gap: 5px;

          padding: 8px 10px;

          color: #ff4b5c;

          font-size: 9px;
          font-weight: 900;
        }

        .youtube-live-player {
          width: 100%;

          aspect-ratio: 16 / 9;

          background: #05070a;
        }

        .youtube-live-player iframe {
          display: block;

          width: 100%;
          height: 100%;

          border: 0;
        }

        .youtube-live-title {
          padding: 10px 10px 3px;

          color: #e4e8ec;

          font-size: 10px;
          font-weight: 800;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .youtube-live-channel {
          padding: 0 10px 10px;

          color: #69737e;

          font-size: 8px;
        }

        .live-link {
          display: block;

          margin: 0 10px 10px;
          padding: 9px;

          background: #171d25;
          border: 1px solid #2a323d;

          border-radius: 4px;

          color: #aeb6c0;

          text-align: center;

          font-size: 8px;
          font-weight: 700;

          transition: all 0.2s ease;
        }

        .live-link:hover {
          color: #ffffff;
          border-color: #d6a928;
        }


        /* ========================================
           쇼츠
        ======================================== */

        .shorts-wrapper {
          width: 100%;
          padding: 10px;

          overflow: hidden;
        }

        .shorts-wrapper > * {
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }


        /* ========================================
           공지
        ======================================== */

        .notice-list {
          padding: 5px 15px 10px;
        }

        .notice-item {
          display: flex;
          align-items: center;

          gap: 8px;

          min-height: 35px;

          border-bottom: 1px solid #171d25;
        }

        .notice-item:last-child {
          border-bottom: none;
        }

        .notice-badge {
          flex-shrink: 0;

          padding: 3px 5px;

          background: rgba(214, 169, 40, 0.1);
          border: 1px solid rgba(214, 169, 40, 0.2);

          border-radius: 3px;

          color: #d6a928;

          font-size: 7px;
          font-weight: 800;
        }

        .notice-text {
          min-width: 0;

          color: #858e99;

          font-size: 8px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }


        /* ========================================
           바로가기
        ======================================== */

        .shortcut-grid {
          padding: 10px;

          display: grid;

          grid-template-columns: repeat(2, 1fr);

          gap: 7px;
        }

        .shortcut {
          min-height: 62px;

          padding: 10px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          background: #10151c;
          border: 1px solid #252c35;

          border-radius: 5px;

          transition: all 0.2s ease;
        }

        .shortcut:hover {
          transform: translateY(-1px);

          border-color: #d6a928;

          background: #141a22;
        }

        .shortcut-icon {
          margin-bottom: 5px;

          font-size: 15px;
        }

        .shortcut-title {
          color: #dce1e6;

          font-size: 9px;
          font-weight: 800;
        }

        .shortcut-sub {
          margin-top: 3px;

          color: #59636e;

          font-size: 7px;
        }


        /* ========================================
           출석
        ======================================== */

        .attendance {
          padding: 16px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background:
            linear-gradient(
              100deg,
              #131a22,
              #0b0f15
            );
        }

        .attendance-left {
          display: flex;
          align-items: center;

          gap: 11px;
        }

        .attendance-icon {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(214, 169, 40, 0.08);
          border: 1px solid rgba(214, 169, 40, 0.18);

          border-radius: 6px;

          font-size: 18px;
        }

        .attendance-title {
          color: #e5e8eb;

          font-size: 10px;
          font-weight: 800;
        }

        .attendance-sub {
          margin-top: 4px;

          color: #5d6772;

          font-size: 7px;
        }

        .attendance-number {
          color: #d6a928;

          font-size: 20px;
          font-weight: 900;
        }

        .attendance-unit {
          margin-left: 3px;

          color: #69737e;

          font-size: 8px;
        }


        /* ========================================
           최근 게시글
        ======================================== */

        .post-list {
          padding: 5px 15px 10px;
        }

        .post-item {
          min-height: 47px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid #171d25;
        }

        .post-item:last-child {
          border-bottom: none;
        }

        .post-main {
          min-width: 0;
          padding-right: 10px;
        }

        .post-title {
          display: block;

          color: #cfd5dc;

          font-size: 9px;
          font-weight: 700;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .post-title:hover {
          color: #d6a928;
        }

        .post-meta {
          margin-top: 4px;

          display: flex;

          gap: 6px;

          color: #505a66;

          font-size: 7px;
        }

        .post-side {
          flex-shrink: 0;

          color: #4d5661;

          font-size: 7px;
        }

        .empty {
          padding: 25px 10px;

          color: #4f5965;

          text-align: center;

          font-size: 8px;
        }


        /* ========================================
           미네랄 안내
        ======================================== */

        .mineral-box {
          padding: 16px;
        }

        .mineral-main {
          display: flex;
          align-items: center;

          gap: 12px;
        }

        .mineral-icon {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #2a2411,
              #16140d
            );

          border: 1px solid #554718;

          border-radius: 7px;

          font-size: 20px;
        }

        .mineral-title {
          color: #dfe3e7;

          font-size: 10px;
          font-weight: 800;
        }

        .mineral-text {
          margin-top: 5px;

          color: #5e6873;

          font-size: 7px;
          line-height: 1.6;
        }

        .mineral-points {
          margin-top: 13px;
          padding-top: 12px;

          display: grid;

          grid-template-columns: repeat(3, 1fr);

          gap: 6px;

          border-top: 1px solid #1d242c;
        }

        .mineral-point {
          text-align: center;
        }

        .mineral-point strong {
          display: block;

          color: #d6a928;

          font-size: 10px;
        }

        .mineral-point span {
          display: block;

          margin-top: 3px;

          color: #555f6a;

          font-size: 6px;
        }


        /* ========================================
           랭킹
        ======================================== */

        .ranking-list {
          padding: 7px 12px 10px;
        }

        .ranking-item {
          min-height: 48px;

          display: flex;
          align-items: center;

          gap: 8px;

          border-bottom: 1px solid #171d25;
        }

        .ranking-item:last-child {
          border-bottom: none;
        }

        .ranking-number {
          width: 20px;

          color: #58626e;

          text-align: center;

          font-size: 8px;
          font-weight: 900;
        }

        .ranking-item:nth-child(1) .ranking-number {
          color: #d6a928;
        }

        .ranking-item:nth-child(2) .ranking-number {
          color: #a9b0b8;
        }

        .ranking-item:nth-child(3) .ranking-number {
          color: #a8764e;
        }

        .ranking-user {
          min-width: 0;

          flex: 1;
        }

        .ranking-name {
          display: block;

          color: #cdd3da;

          font-size: 8px;
          font-weight: 800;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ranking-mineral {
          margin-top: 3px;

          color: #59636e;

          font-size: 6px;
        }

        .ranking-mineral b {
          color: #d6a928;
        }


        /* ========================================
           게임 / 상점
        ======================================== */

        .side-menu {
          padding: 10px;

          display: flex;
          flex-direction: column;

          gap: 7px;
        }

        .side-button {
          min-height: 55px;

          padding: 11px;

          display: flex;
          align-items: center;

          gap: 10px;

          background: #10151c;
          border: 1px solid #252c35;

          border-radius: 5px;

          transition: all 0.2s ease;
        }

        .side-button:hover {
          border-color: #d6a928;

          background: #141a22;
        }

        .side-button-icon {
          font-size: 17px;
        }

        .side-button-title {
          color: #d8dde2;

          font-size: 9px;
          font-weight: 800;
        }

        .side-button-sub {
          display: block;

          margin-top: 3px;

          color: #555f6a;

          font-size: 7px;
        }


        /* ========================================
           후원
        ======================================== */

        .donation {
          padding: 14px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(214,169,40,0.09),
              transparent 45%
            ),
            #0b0f15;
        }

        .donation-title {
          color: #e0e4e8;

          font-size: 9px;
          font-weight: 800;
        }

        .donation-text {
          margin-top: 6px;

          color: #59636e;

          font-size: 7px;
          line-height: 1.6;
        }

        .donation-button {
          display: block;

          margin-top: 10px;
          padding: 9px;

          background: #161c24;
          border: 1px solid #303945;

          border-radius: 4px;

          color: #cfd5db;

          text-align: center;

          font-size: 8px;
          font-weight: 800;

          transition: all 0.2s ease;
        }

        .donation-button:hover {
          border-color: #d6a928;

          color: #d6a928;
        }


        /* ========================================
           반응형
        ======================================== */

        @media (max-width: 1050px) {

          .home-grid {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(0, 1fr);
          }

          .home-column:last-child {
            grid-column: 1 / -1;

            display: grid;

            grid-template-columns:
              repeat(3, minmax(0, 1fr));

            gap: 10px;
          }
        }

        @media (max-width: 720px) {

          .hero {
            min-height: 175px;

            padding: 22px;
          }

          .hero-title {
            font-size: 26px;
          }

          .hero::after {
            right: -5px;

            font-size: 90px;
          }

          .home-grid {
            grid-template-columns: 1fr;
          }

          .home-column:last-child {
            grid-column: auto;

            display: flex;
          }

          .shortcut-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

      `}</style>


      {/* ========================================
          HERO
      ======================================== */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-label">
            HYERORO COMMUNITY
          </div>

          <h1 className="hero-title">
            안녕하세요, <span>혜로로</span>입니다.
          </h1>

          <p className="hero-description">
            혜로로와 함께 즐기는 팬 커뮤니티
            <br />
            이야기를 나누고 미네랄을 모아보세요.
          </p>

          <div className="hero-buttons">

            <Link
              href="/board"
              className="hero-button primary"
            >
              게시판 들어가기
            </Link>

            <Link
              href="/attendance"
              className="hero-button secondary"
            >
              오늘 출석하기
            </Link>

          </div>

        </div>

      </section>


      {/* ========================================
          3단 메인
      ======================================== */}

      <div className="home-grid">


        {/* ======================================
            LEFT
        ====================================== */}

        <div className="home-column">


          {/* LIVE */}

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

            {/* 실제 LIVE 컴포넌트 */}

            <YouTubeLive />

            <a
              href="https://www.youtube.com/@HyeroroTV/live"
              target="_blank"
              rel="noopener noreferrer"
              className="live-link"
            >
              📺 유튜브 LIVE 채널 보기
            </a>

          </section>


          {/* SHORTS */}

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
                전체 보기 →
              </a>

            </div>

            <div className="shorts-wrapper">
              <YouTubeShorts />
            </div>

          </section>


          {/* NOTICE */}

          <section className="home-card">

            <div className="card-header">

              <h2 className="card-title">
                📢 공지사항
              </h2>

              <Link
                href="/board"
                className="card-more"
              >
                더보기 →
              </Link>

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
                  INFO
                </span>

                <span className="notice-text">
                  출석체크를 하면 매일 미네랄을 받을 수 있습니다.
                </span>

              </div>


              <div className="notice-item">

                <span className="notice-badge">
                  SHOP
                </span>

                <span className="notice-text">
                  모은 미네랄은 상점에서 사용할 수 있습니다.
                </span>

              </div>

            </div>

          </section>

        </div>


        {/* ======================================
            CENTER
        ====================================== */}

        <div className="home-column">


          {/* 빠른 메뉴 */}

          <section className="home-card">

            <div className="card-header">

              <h2 className="card-title">
                ⚡ 빠른 메뉴
              </h2>

            </div>

            <div className="shortcut-grid">

              <Link
                href="/board"
                className="shortcut"
              >

                <span className="shortcut-icon">
                  💬
                </span>

                <span className="shortcut-title">
                  자유게시판
                </span>

                <span className="shortcut-sub">
                  자유롭게 이야기해요
                </span>

              </Link>


              <Link
                href="/ranking"
                className="shortcut"
              >

                <span className="shortcut-icon">
                  🏆
                </span>

                <span className="shortcut-title">
                  미네랄 랭킹
                </span>

                <span className="shortcut-sub">
                  현재 순위를 확인
                </span>

              </Link>


              <Link
                href="/attendance"
                className="shortcut"
              >

                <span className="shortcut-icon">
                  📅
                </span>

                <span className="shortcut-title">
                  출석체크
                </span>

                <span className="shortcut-sub">
                  매일 미네랄 받기
                </span>

              </Link>


              <Link
                href="/mypage"
                className="shortcut"
              >

                <span className="shortcut-icon">
                  👤
                </span>

                <span className="shortcut-title">
                  마이페이지
                </span>

                <span className="shortcut-sub">
                  내 활동 확인
                </span>

              </Link>

            </div>

          </section>


          {/* 출석 */}

          <section className="home-card">

            <div className="card-header">

              <h2 className="card-title">
                📅 오늘의 출석
              </h2>

              <Link
                href="/attendance"
                className="card-more"
              >
                출석하러 가기 →
              </Link>

            </div>

            <div className="attendance">

              <div className="attendance-left">

                <div className="attendance-icon">
                  🎁
                </div>

                <div>

                  <div className="attendance-title">
                    오늘도 출석하셨나요?
                  </div>

                  <div className="attendance-sub">
                    출석하면 미네랄을 받을 수 있어요.
                  </div>

                </div>

              </div>

              <div>

                <span className="attendance-number">
                  {todayAttendanceCount}
                </span>

                <span className="attendance-unit">
                  명
                </span>

              </div>

            </div>

          </section>


          {/* 최근 게시글 */}

          <section className="home-card">

            <div className="card-header">

              <h2 className="card-title">
                💬 최근 게시글
              </h2>

              <Link
                href="/board"
                className="card-more"
              >
                게시판 →
              </Link>

            </div>

            <div className="post-list">

              {recentPosts.length === 0 ? (

                <div className="empty">
                  아직 등록된 게시글이 없습니다.
                </div>

              ) : (

                recentPosts.map((post) => (

                  <div
                    key={post.id}
                    className="post-item"
                  >

                    <div className="post-main">

                      <Link
                        href={`/board/${post.id}`}
                        className="post-title"
                      >
                        {post.title}
                      </Link>

                      <div className="post-meta">

                        <span>
                          {getNickname(post.user_id)}
                        </span>

                        <span>
                          {formatDate(post.created_at)}
                        </span>

                      </div>

                    </div>

                    <div className="post-side">
                      👁 {post.view_count ?? 0}
                    </div>

                  </div>

                ))

              )}

            </div>

          </section>


          {/* 미네랄 */}

          <section className="home-card">

            <div className="card-header">

              <h2 className="card-title">
                ⛏️ 미네랄
              </h2>

              <Link
                href="/shop"
                className="card-more"
              >
                상점 →
              </Link>

            </div>

            <div className="mineral-box">

              <div className="mineral-main">

                <div className="mineral-icon">
                  ⛏️
                </div>

                <div>

                  <div className="mineral-title">
                    혜로로의 활동 재화
                  </div>

                  <div className="mineral-text">
                    출석, 게임, 커뮤니티 활동 등을 통해
                    <br />
                    미네랄을 모으고 다양한 곳에 사용해보세요.
                  </div>

                </div>

              </div>

              <div className="mineral-points">

                <div className="mineral-point">

                  <strong>
                    +10
                  </strong>

                  <span>
                    출석
                  </span>

                </div>


                <div className="mineral-point">

                  <strong>
                    GAME
                  </strong>

                  <span>
                    게임
                  </span>

                </div>


                <div className="mineral-point">

                  <strong>
                    SHOP
                  </strong>

                  <span>
                    상점
                  </span>

                </div>

              </div>

            </div>

          </section>


          {/* 이용 안내 */}

          <section className="home-card">

            <div className="card-header">

              <h2 className="card-title">
                ℹ️ 이용 안내
              </h2>

            </div>

            <div className="notice-list">

              <div className="notice-item">

                <span className="notice-badge">
                  01
                </span>

                <span className="notice-text">
                  회원가입 후 커뮤니티를 이용해주세요.
                </span>

              </div>


              <div className="notice-item">

                <span className="notice-badge">
                  02
                </span>

                <span className="notice-text">
                  매일 출석하고 미네랄을 모아보세요.
                </span>

              </div>


              <div className="notice-item">

                <span className="notice-badge">
                  03
                </span>

                <span className="notice-text">
                  미네랄 게임과 상점도 이용할 수 있습니다.
                </span>

              </div>

            </div>

          </section>

        </div>


        {/* ======================================
            RIGHT
        ====================================== */}

        <div className="home-column">


          {/* 랭킹 */}

          <section className="home-card">

            <div className="card-header">

              <h2 className="card-title">
                🏆 미네랄 랭킹
              </h2>

              <Link
                href="/ranking"
                className="card-more"
              >
                전체 →
              </Link>

            </div>

            <div className="ranking-list">

              {ranking.length === 0 ? (

                <div className="empty">
                  아직 랭킹 데이터가 없습니다.
                </div>

              ) : (

                ranking.map((profile, index) => (

                  <div
                    key={profile.id}
                    className="ranking-item"
                  >

                    <div className="ranking-number">
                      {index + 1}
                    </div>

                    <div className="ranking-user">

                      <span className="ranking-name">
                        {profile.nickname || "익명"}
                      </span>

                      <div className="ranking-mineral">
                        ⛏️{" "}
                        <b>
                          {profile.minerals ?? 0}
                        </b>{" "}
                        미네랄
                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

          </section>


          {/* 게임 */}

          <section className="home-card">

            <div className="card-header">

              <h2 className="card-title">
                🎮 미네랄 게임
              </h2>

            </div>

            <div className="side-menu">

              <Link
                href="/games"
                className="side-button"
              >

                <span className="side-button-icon">
                  🎲
                </span>

                <span>

                  <span className="side-button-title">
                    주사위 게임
                  </span>

                  <span className="side-button-sub">
                    미네랄 게임을 즐겨보세요
                  </span>

                </span>

              </Link>

            </div>

          </section>


          {/* 상점 */}

          <section className="home-card">

            <div className="card-header">

              <h2 className="card-title">
                🛒 미네랄 상점
              </h2>

              <Link
                href="/shop"
                className="card-more"
              >
                상점 →
              </Link>

            </div>

            <div className="side-menu">

              <Link
                href="/shop"
                className="side-button"
              >

                <span className="side-button-icon">
                  💎
                </span>

                <span>

                  <span className="side-button-title">
                    아이템 구매
                  </span>

                  <span className="side-button-sub">
                    모은 미네랄을 사용해보세요
                  </span>

                </span>

              </Link>

            </div>

          </section>


          {/* 후원 */}

          <section className="home-card">

            <div className="donation">

              <div className="donation-title">
                💛 혜로로 응원하기
              </div>

              <div className="donation-text">
                혜로로를 응원해주시는 분들의
                <br />
                소중한 후원에 감사드립니다.
              </div>

              <a
                href="https://toon.at/donate/hyeroro"
                target="_blank"
                rel="noopener noreferrer"
                className="donation-button"
              >
                💛 후원하기
              </a>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}