import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import YouTubeLive from "@/components/YouTubeLive";
import YouTubeShorts from "@/components/YouTubeShorts";

type Post = {
  id: number;
  title: string;
  created_at: string;
  view_count: number | null;
  user_id: string;
};

type Profile = {
  id: string;
  nickname: string;
  minerals: number;
};

type ShopItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
};

export default async function HomePage() {
  const supabase = await createClient();

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Seoul",
  });

  const [
    { data: recentPostData },
    { data: popularPostData },
    { data: rankingData },
    { count: attendanceCount },
    { data: shopData },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, created_at, view_count, user_id")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("posts")
      .select("id, title, created_at, view_count, user_id")
      .order("view_count", { ascending: false })
      .limit(5),

    supabase
      .from("profiles")
      .select("id, nickname, minerals")
      .order("minerals", { ascending: false })
      .limit(5),

    supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .eq("attendance_date", today),

    supabase
      .from("shop_items")
      .select("id, name, price, image_url")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(5),

    supabase.auth.getUser(),
  ]);

  const recentPosts: Post[] = recentPostData ?? [];
  const popularPosts: Post[] = popularPostData ?? [];
  const ranking: Profile[] = rankingData ?? [];
  const recommendedItems: ShopItem[] = shopData ?? [];

  const todayAttendanceCount = attendanceCount ?? 0;

  const allUserIds = [
    ...new Set(
      [...recentPosts, ...popularPosts].map((post) => post.user_id)
    ),
  ];

  let postProfiles: Profile[] = [];

  if (allUserIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, nickname, minerals")
      .in("id", allUserIds);

    postProfiles = data ?? [];
  }

  const getNickname = (userId: string) =>
    postProfiles.find((profile) => profile.id === userId)?.nickname ??
    "익명";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    });

  let myNickname = "회원";
  let myMinerals = 0;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("nickname, minerals")
      .eq("id", user.id)
      .maybeSingle();

    myNickname = data?.nickname ?? "회원";
    myMinerals = data?.minerals ?? 0;
  }

  return (
    <div className="hyeroro-home">
      <style>{`
        .hyeroro-home {
          width: 100%;
          min-height: 100%;
          background: #0b0f14;
          color: #d9dde3;
        }

        .hyeroro-home *,
        .hyeroro-home *::before,
        .hyeroro-home *::after {
          box-sizing: border-box;
        }

        .hyeroro-home a {
          color: inherit;
          text-decoration: none;
        }

        .home-container {
          width: min(1180px, calc(100% - 24px));
          margin: 0 auto;
          padding: 14px 0 45px;
        }

        .home-section {
          background: #10151b;
          border: 1px solid #252c35;
          border-radius: 5px;
          overflow: hidden;
        }

        .section-title {
          min-height: 42px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #252c35;
          background: #121820;
        }

        .section-title h2 {
          margin: 0;
          color: #e6e9ed;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .section-more {
          color: #68737e;
          font-size: 10px;
          font-weight: 800;
        }

        .section-more:hover {
          color: #d6a928;
        }

        /*
         * TOP
         */

        .top-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(300px, 1fr);
          gap: 10px;
        }

        .live-section {
          background: #080b10;
        }

        .live-heading {
          padding: 14px 15px 10px;
          font-size: 18px;
          font-weight: 900;
          color: #f2f4f6;
        }

        .live-content {
          padding: 0 15px 15px;
        }

        .shorts-content {
          padding: 10px 12px 12px;
        }

        /*
         * SHORTCUT
         */

        .shortcut-section {
          margin-top: 10px;
        }

        .shortcut-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
          padding: 9px;
        }

        .shortcut {
          min-height: 65px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: 1px solid #29313b;
          border-radius: 4px;
          background: #141a21;
          transition: 0.15s ease;
        }

        .shortcut:hover {
          background: #191f27;
          border-color: #b89225;
          transform: translateY(-1px);
        }

        .shortcut-icon {
          font-size: 20px;
          line-height: 1;
        }

        .shortcut-name {
          color: #cbd1d7;
          font-size: 9px;
          font-weight: 800;
        }

        /*
         * MAIN
         */

        .portal-grid {
          margin-top: 10px;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1.15fr) minmax(250px, 0.8fr);
          gap: 10px;
          align-items: start;
        }

        .portal-column {
          min-width: 0;
        }

        .portal-section {
          margin-bottom: 10px;
        }

        /*
         * ATTENDANCE
         */

        .attendance-box {
          padding: 14px;
        }

        .attendance-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .attendance-info {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .attendance-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          background: #18150e;
          border: 1px solid #3b321d;
          border-radius: 5px;
          font-size: 20px;
        }

        .attendance-label {
          color: #e1e4e8;
          font-size: 12px;
          font-weight: 900;
        }

        .attendance-desc {
          margin-top: 4px;
          color: #68737d;
          font-size: 9px;
        }

        .attendance-number {
          color: #d6a928;
          font-size: 24px;
          font-weight: 900;
          white-space: nowrap;
        }

        .attendance-number span {
          margin-left: 3px;
          color: #68737d;
          font-size: 9px;
        }

        .attendance-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
          margin-top: 12px;
        }

        .small-button {
          padding: 8px;
          text-align: center;
          background: #151b22;
          border: 1px solid #29313b;
          border-radius: 4px;
          color: #c8ced4;
          font-size: 9px;
          font-weight: 800;
        }

        .small-button:hover {
          border-color: #b89225;
          color: #d6a928;
        }

        /*
         * GAME
         */

        .game-list {
          padding: 5px 10px 8px;
        }

        .game-item {
          min-height: 49px;
          display: flex;
          align-items: center;
          gap: 9px;
          border-bottom: 1px solid #1d242c;
        }

        .game-item:last-child {
          border-bottom: 0;
        }

        .game-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          background: #181e25;
          border-radius: 4px;
          font-size: 16px;
        }

        .game-info {
          min-width: 0;
          flex: 1;
        }

        .game-name {
          font-size: 10px;
          font-weight: 900;
          color: #d5dae0;
        }

        .game-desc {
          margin-top: 2px;
          color: #626d78;
          font-size: 8px;
        }

        .game-arrow {
          color: #626d78;
          font-size: 11px;
        }

        /*
         * RANKING
         */

        .ranking-tabs {
          display: flex;
          gap: 4px;
          padding: 9px 10px 5px;
        }

        .ranking-tab {
          padding: 5px 9px;
          background: #181e25;
          border-radius: 3px;
          color: #707b86;
          font-size: 8px;
          font-weight: 900;
        }

        .ranking-tab.active {
          background: #241f10;
          color: #d6a928;
        }

        .ranking-list {
          padding: 0 10px 8px;
        }

        .ranking-item {
          min-height: 51px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #1d242c;
        }

        .ranking-item:last-child {
          border-bottom: 0;
        }

        .rank-number {
          width: 28px;
          text-align: center;
          color: #6c7680;
          font-size: 9px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .rank-number.top {
          color: #d6a928;
          font-size: 13px;
        }

        .rank-user {
          min-width: 0;
          flex: 1;
        }

        .rank-name {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #d7dce1;
          font-size: 10px;
          font-weight: 900;
        }

        .rank-mineral {
          margin-top: 3px;
          color: #606b76;
          font-size: 8px;
        }

        .rank-mineral b {
          color: #d6a928;
        }

        /*
         * STOCK
         */

        .stock-list {
          padding: 3px 11px 7px;
        }

        .stock-item {
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border-bottom: 1px solid #1d242c;
        }

        .stock-item:last-child {
          border-bottom: 0;
        }

        .stock-name {
          color: #cbd1d7;
          font-size: 9px;
          font-weight: 800;
        }

        .stock-status {
          color: #59646f;
          font-size: 8px;
        }

        /*
         * SHOP
         */

        .shop-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 5px;
          padding: 9px;
        }

        .shop-card {
          overflow: hidden;
          border: 1px solid #29313b;
          border-radius: 4px;
          background: #141a21;
          transition: 0.15s ease;
        }

        .shop-card:hover {
          border-color: #b89225;
          transform: translateY(-1px);
        }

        .shop-image {
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          background: #080b10;
        }

        .shop-info {
          padding: 6px;
        }

        .shop-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #d4d9de;
          font-size: 8px;
          font-weight: 900;
        }

        .shop-price {
          margin-top: 3px;
          color: #d6a928;
          font-size: 8px;
          font-weight: 900;
        }

        /*
         * POST LIST
         */

        .post-list {
          padding: 2px 11px 7px;
        }

        .post-row {
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border-bottom: 1px solid #1d242c;
        }

        .post-row:last-child {
          border-bottom: 0;
        }

        .post-info {
          min-width: 0;
        }

        .post-title {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #cfd4da;
          font-size: 10px;
          font-weight: 800;
        }

        .post-title:hover {
          color: #d6a928;
        }

        .post-meta {
          margin-top: 3px;
          color: #59646f;
          font-size: 8px;
        }

        .post-view {
          flex-shrink: 0;
          color: #59646f;
          font-size: 8px;
        }

        /*
         * NOTICE
         */

        .notice-list {
          padding: 2px 11px 7px;
        }

        .notice-item {
          min-height: 39px;
          display: flex;
          align-items: center;
          gap: 7px;
          border-bottom: 1px solid #1d242c;
        }

        .notice-item:last-child {
          border-bottom: 0;
        }

        .notice-label {
          flex-shrink: 0;
          padding: 3px 5px;
          color: #d6a928;
          background: #241f10;
          border: 1px solid #403820;
          border-radius: 2px;
          font-size: 7px;
          font-weight: 900;
        }

        .notice-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #c5cbd1;
          font-size: 9px;
        }

        /*
         * EMPTY
         */

        .empty {
          padding: 20px 10px;
          text-align: center;
          color: #59646f;
          font-size: 9px;
        }

        /*
         * MY ACTIVITY
         */

        .activity-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          padding: 8px;
        }

        .activity-button {
          padding: 10px 4px;
          text-align: center;
          border: 1px solid #29313b;
          border-radius: 4px;
          background: #141a21;
          color: #c9cfd5;
          font-size: 8px;
          font-weight: 900;
        }

        .activity-button:hover {
          border-color: #b89225;
          color: #d6a928;
        }

        /*
         * MINERAL
         */

        .mineral-box {
          padding: 14px;
        }

        .mineral-user {
          color: #68737e;
          font-size: 9px;
        }

        .mineral-value {
          margin-top: 5px;
          color: #d6a928;
          font-size: 28px;
          font-weight: 900;
          line-height: 1;
        }

        .mineral-link {
          display: block;
          margin-top: 12px;
          padding: 8px;
          text-align: center;
          border: 1px solid #29313b;
          border-radius: 4px;
          background: #151b22;
          color: #c9cfd5;
          font-size: 9px;
          font-weight: 900;
        }

        .mineral-link:hover {
          border-color: #b89225;
          color: #d6a928;
        }

        /*
         * PLACEHOLDER
         */

        .placeholder {
          padding: 12px;
        }

        .placeholder-inner {
          padding: 18px 10px;
          border: 1px dashed #29313b;
          background: #0f141a;
          color: #59646f;
          text-align: center;
          font-size: 9px;
        }

        /*
         * LOTTO
         */

        .lotto-box {
          padding: 14px;
        }

        .lotto-current {
          color: #6c7782;
          font-size: 9px;
        }

        .lotto-number {
          margin-top: 4px;
          color: #d6a928;
          font-size: 22px;
          font-weight: 900;
        }

        .lotto-info {
          margin-top: 9px;
          padding-top: 9px;
          border-top: 1px solid #222933;
          display: grid;
          gap: 5px;
        }

        .lotto-row {
          display: flex;
          justify-content: space-between;
          color: #6b7681;
          font-size: 8px;
        }

        .lotto-row b {
          color: #cbd1d6;
        }

        /*
         * QUEST
         */

        .quest-list {
          padding: 4px 10px 8px;
        }

        .quest-item {
          min-height: 43px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #1d242c;
        }

        .quest-item:last-child {
          border-bottom: 0;
        }

        .quest-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          background: #181e25;
          border-radius: 4px;
        }

        .quest-text {
          min-width: 0;
          flex: 1;
        }

        .quest-name {
          color: #cfd4da;
          font-size: 9px;
          font-weight: 900;
        }

        .quest-reward {
          margin-top: 2px;
          color: #d6a928;
          font-size: 8px;
        }

        /*
         * RESPONSIVE
         */

        @media (max-width: 950px) {
          .portal-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .portal-column:last-child {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            align-items: start;
          }

          .portal-column:last-child .portal-section {
            margin-bottom: 0;
          }
        }

        @media (max-width: 700px) {
          .home-container {
            width: calc(100% - 14px);
            padding-top: 8px;
          }

          .top-layout {
            grid-template-columns: 1fr;
          }

          .shortcut-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .portal-grid {
            grid-template-columns: 1fr;
          }

          .portal-column:last-child {
            grid-column: auto;
            display: block;
          }

          .portal-column:last-child .portal-section {
            margin-bottom: 10px;
          }

          .shop-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 430px) {
          .shortcut-grid {
            grid-template-columns: repeat(4, 1fr);
            padding: 6px;
          }

          .shortcut {
            min-height: 57px;
          }

          .shortcut-icon {
            font-size: 17px;
          }

          .shortcut-name {
            font-size: 8px;
          }

          .shop-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="home-container">

        {/* LIVE + SHORTS */}

        <div className="top-layout">

          <section className="home-section live-section">
            <div className="live-heading">
              🔴 혜로로 LIVE
            </div>

            <div className="live-content">
              <YouTubeLive />
            </div>
          </section>

          <section className="home-section">
            <div className="section-title">
              <h2>최근 쇼츠</h2>

              <a
                href="https://www.youtube.com/@HyeroroTV/shorts"
                target="_blank"
                rel="noopener noreferrer"
                className="section-more"
              >
                전체 보기 〉
              </a>
            </div>

            <div className="shorts-content">
              <YouTubeShorts />
            </div>
          </section>

        </div>

        {/* 바로가기 */}

        <section className="home-section shortcut-section">

          <div className="section-title">
            <h2>바로가기</h2>
          </div>

          <div className="shortcut-grid">

            <Link href="/attendance" className="shortcut">
              <span className="shortcut-icon">📅</span>
              <span className="shortcut-name">방송일정</span>
            </Link>

            <Link href="/board" className="shortcut">
              <span className="shortcut-icon">📢</span>
              <span className="shortcut-name">방송미션</span>
            </Link>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="shortcut"
            >
              <span className="shortcut-icon">📸</span>
              <span className="shortcut-name">인스타</span>
            </a>

            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="shortcut"
            >
              <span className="shortcut-icon">🎵</span>
              <span className="shortcut-name">틱톡</span>
            </a>

            <a
              href="https://toon.at/"
              target="_blank"
              rel="noopener noreferrer"
              className="shortcut"
            >
              <span className="shortcut-icon">💰</span>
              <span className="shortcut-name">후원</span>
            </a>

            <Link href="/shop" className="shortcut">
              <span className="shortcut-icon">🛒</span>
              <span className="shortcut-name">상점</span>
            </Link>

            <Link href="/board" className="shortcut">
              <span className="shortcut-icon">💬</span>
              <span className="shortcut-name">게시판</span>
            </Link>

          </div>
        </section>

        {/* PORTAL */}

        <div className="portal-grid">

          {/* COLUMN 1 */}

          <div className="portal-column">

            {/* 출석 */}

            <section className="home-section portal-section">

              <div className="section-title">
                <h2>출석 현황</h2>

                <Link
                  href="/attendance"
                  className="section-more"
                >
                  출석체크 〉
                </Link>
              </div>

              <div className="attendance-box">

                <div className="attendance-main">

                  <div className="attendance-info">

                    <div className="attendance-icon">
                      📅
                    </div>

                    <div>
                      <div className="attendance-label">
                        오늘 출석
                      </div>

                      <div className="attendance-desc">
                        출석하면 ⛏️ 미네랄 +10
                      </div>
                    </div>

                  </div>

                  <div className="attendance-number">
                    {todayAttendanceCount}
                    <span>명</span>
                  </div>

                </div>

                <div className="attendance-actions">

                  <Link
                    href="/attendance"
                    className="small-button"
                  >
                    📅 출석체크
                  </Link>

                  <Link
                    href="/attendance"
                    className="small-button"
                  >
                    ⛏️ 미네랄 받기
                  </Link>

                </div>

              </div>

            </section>

            {/* 게임 현황 */}

            <section className="home-section portal-section">

              <div className="section-title">
                <h2>게임 현황</h2>

                <Link
                  href="/games"
                  className="section-more"
                >
                  전체 게임 바로가기 〉
                </Link>
              </div>

              <div className="game-list">

                <Link href="/games" className="game-item">

                  <div className="game-icon">
                    🎲
                  </div>

                  <div className="game-info">

                    <div className="game-name">
                      주사위 게임
                    </div>

                    <div className="game-desc">
                      미네랄로 즐기는 주사위 게임
                    </div>

                  </div>

                  <div className="game-arrow">
                    〉
                  </div>

                </Link>

                <Link href="/games" className="game-item">

                  <div className="game-icon">
                    🪜
                  </div>

                  <div className="game-info">

                    <div className="game-name">
                      사다리 게임
                    </div>

                    <div className="game-desc">
                      게임 콘텐츠 준비중
                    </div>

                  </div>

                  <div className="game-arrow">
                    〉
                  </div>

                </Link>

                <Link href="/games" className="game-item">

                  <div className="game-icon">
                    📊
                  </div>

                  <div className="game-info">

                    <div className="game-name">
                      승패 예측
                    </div>

                    <div className="game-desc">
                      게임 콘텐츠 준비중
                    </div>

                  </div>

                  <div className="game-arrow">
                    〉
                  </div>

                </Link>

              </div>

            </section>

            {/* 게임 하이라이트 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>게임 하이라이트</h2>

                <Link
                  href="/games"
                  className="section-more"
                >
                  전체 보기 〉
                </Link>

              </div>

              <div className="placeholder">

                <div className="placeholder-inner">
                  게임 하이라이트를 불러오는 중입니다.
                </div>

              </div>

            </section>

            {/* 상점 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>상점 추천 아이템</h2>

                <Link
                  href="/shop"
                  className="section-more"
                >
                  전체 보기 〉
                </Link>

              </div>

              {recommendedItems.length === 0 ? (

                <div className="empty">
                  등록된 상점 아이템이 없습니다.
                </div>

              ) : (

                <div className="shop-grid">

                  {recommendedItems.map((item) => (

                    <Link
                      href="/shop"
                      className="shop-card"
                      key={item.id}
                    >

                      {item.image_url ? (

                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="shop-image"
                        />

                      ) : (

                        <div className="shop-image" />

                      )}

                      <div className="shop-info">

                        <div className="shop-name">
                          {item.name}
                        </div>

                        <div className="shop-price">
                          ⛏️ {item.price.toLocaleString()}
                        </div>

                      </div>

                    </Link>

                  ))}

                </div>

              )}

            </section>

          </div>

          {/* COLUMN 2 */}

          <div className="portal-column">

            {/* 랭킹 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>랭킹</h2>

                <Link
                  href="/ranking"
                  className="section-more"
                >
                  전체 보기 〉
                </Link>

              </div>

              <div className="ranking-tabs">

                <span className="ranking-tab active">
                  ⛏️ 미네랄
                </span>

                <span className="ranking-tab">
                  🎮 게임
                </span>

                <span className="ranking-tab">
                  📈 주식
                </span>

              </div>

              <div className="ranking-list">

                {ranking.length === 0 ? (

                  <div className="empty">
                    랭킹 데이터가 없습니다.
                  </div>

                ) : (

                  ranking.map((profile, index) => (

                    <div
                      className="ranking-item"
                      key={profile.id}
                    >

                      <div
                        className={
                          index < 3
                            ? "rank-number top"
                            : "rank-number"
                        }
                      >

                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `${index + 1}위`}

                      </div>

                      <div className="rank-user">

                        <span className="rank-name">
                          {profile.nickname || "익명"}
                        </span>

                        <div className="rank-mineral">
                          보유{" "}
                          <b>
                            {(profile.minerals ?? 0).toLocaleString()}
                          </b>{" "}
                          미네랄
                        </div>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </section>

            {/* 주식 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>📈 주식 현황</h2>

                <span className="section-more">
                  준비중
                </span>

              </div>

              <div className="stock-list">

                <div className="stock-item">
                  <span className="stock-name">
                    혜로로 엔터
                  </span>

                  <span className="stock-status">
                    준비중
                  </span>
                </div>

                <div className="stock-item">
                  <span className="stock-name">
                    혜로로 게임즈
                  </span>

                  <span className="stock-status">
                    준비중
                  </span>
                </div>

                <div className="stock-item">
                  <span className="stock-name">
                    미네랄 테크
                  </span>

                  <span className="stock-status">
                    준비중
                  </span>
                </div>

                <div className="stock-item">
                  <span className="stock-name">
                    혜로로 푸드
                  </span>

                  <span className="stock-status">
                    준비중
                  </span>
                </div>

                <div className="stock-item">
                  <span className="stock-name">
                    드론단
                  </span>

                  <span className="stock-status">
                    준비중
                  </span>
                </div>

              </div>

            </section>

            {/* 공지 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>공지사항</h2>

                <Link
                  href="/board"
                  className="section-more"
                >
                  전체 보기 〉
                </Link>

              </div>

              <div className="notice-list">

                <div className="notice-item">

                  <span className="notice-label">
                    NOTICE
                  </span>

                  <span className="notice-text">
                    혜로로 팬 커뮤니티에 오신 것을 환영합니다.
                  </span>

                </div>

                <div className="notice-item">

                  <span className="notice-label">
                    INFO
                  </span>

                  <span className="notice-text">
                    매일 출석하고 미네랄을 모아보세요.
                  </span>

                </div>

                <div className="notice-item">

                  <span className="notice-label">
                    SHOP
                  </span>

                  <span className="notice-text">
                    모은 미네랄은 혜로로 상점에서 사용할 수 있습니다.
                  </span>

                </div>

                <div className="notice-item">

                  <span className="notice-label">
                    GAME
                  </span>

                  <span className="notice-text">
                    미네랄 게임 콘텐츠를 준비하고 있습니다.
                  </span>

                </div>

                <div className="notice-item">

                  <span className="notice-label">
                    UPDATE
                  </span>

                  <span className="notice-text">
                    혜로로 사이트가 계속 업데이트되고 있습니다.
                  </span>

                </div>

              </div>

            </section>

            {/* 인기글 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>🔥 인기글</h2>

                <Link
                  href="/board"
                  className="section-more"
                >
                  전체 보기 〉
                </Link>

              </div>

              <div className="post-list">

                {popularPosts.length === 0 ? (

                  <div className="empty">
                    인기글이 없습니다.
                  </div>

                ) : (

                  popularPosts.map((post) => (

                    <div
                      className="post-row"
                      key={`popular-${post.id}`}
                    >

                      <div className="post-info">

                        <Link
                          href={`/board/${post.id}`}
                          className="post-title"
                        >
                          {post.title}
                        </Link>

                        <div className="post-meta">
                          {getNickname(post.user_id)}
                          {" · "}
                          {formatDate(post.created_at)}
                        </div>

                      </div>

                      <div className="post-view">
                        👁 {post.view_count ?? 0}
                      </div>

                    </div>

                  ))

                )}

              </div>

            </section>

            {/* 최근 게시글 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>최근 게시글</h2>

                <Link
                  href="/board"
                  className="section-more"
                >
                  전체 보기 〉
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
                      className="post-row"
                      key={post.id}
                    >

                      <div className="post-info">

                        <Link
                          href={`/board/${post.id}`}
                          className="post-title"
                        >
                          {post.title}
                        </Link>

                        <div className="post-meta">
                          {getNickname(post.user_id)}
                          {" · "}
                          {formatDate(post.created_at)}
                        </div>

                      </div>

                      <div className="post-view">
                        👁 {post.view_count ?? 0}
                      </div>

                    </div>

                  ))

                )}

              </div>

            </section>

            {/* 최근 댓글 */}

            <section className="home-section portal-section">

              <div className="section-title">
                <h2>최근 댓글</h2>
              </div>

              <div className="empty">
                최근 댓글 기능을 준비하고 있습니다.
              </div>

            </section>

          </div>

          {/* COLUMN 3 */}

          <aside className="portal-column">

            {/* 내 미네랄 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>⛏️ 내 미네랄</h2>

                <Link
                  href="/mypage"
                  className="section-more"
                >
                  내 정보 〉
                </Link>

              </div>

              <div className="mineral-box">

                <div className="mineral-user">

                  {user
                    ? `${myNickname}님의 보유 미네랄`
                    : "로그인 후 미네랄을 확인하세요"}

                </div>

                <div className="mineral-value">

                  {user
                    ? myMinerals.toLocaleString()
                    : "0"}

                </div>

                <Link
                  href="/shop"
                  className="mineral-link"
                >
                  🛒 미네랄 상점 이용하기
                </Link>

              </div>

            </section>

            {/* 내 활동 */}

            <section className="home-section portal-section">

              <div className="section-title">
                <h2>내 활동</h2>
              </div>

              {!user ? (

                <div className="empty">
                  로그인하면 내 활동을 확인할 수 있습니다.
                </div>

              ) : (

                <div className="activity-grid">

                  <Link
                    href="/attendance"
                    className="activity-button"
                  >
                    📅 출석
                  </Link>

                  <Link
                    href="/games"
                    className="activity-button"
                  >
                    🎮 게임
                  </Link>

                  <Link
                    href="/shop"
                    className="activity-button"
                  >
                    🛒 상점
                  </Link>

                </div>

              )}

            </section>

            {/* 방송 미션 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>📢 방송 미션</h2>

                <span className="section-more">
                  준비중
                </span>

              </div>

              <div className="placeholder">

                <div className="placeholder-inner">
                  현재 진행중인 방송 미션이 없습니다.
                </div>

              </div>

            </section>

            {/* 미네랄 이벤트 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>🎟️ 미네랄 이벤트</h2>

                <Link
                  href="/shop"
                  className="section-more"
                >
                  참여하기 〉
                </Link>

              </div>

              <div className="placeholder">

                <div className="placeholder-inner">
                  혜로로 이벤트를 준비하고 있습니다.
                </div>

              </div>

            </section>

            {/* 일일 퀘스트 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>⛏️ 미네랄 일일퀘스트</h2>

                <span className="section-more">
                  매일 초기화
                </span>

              </div>

              <div className="quest-list">

                <Link
                  href="/attendance"
                  className="quest-item"
                >

                  <div className="quest-icon">
                    📅
                  </div>

                  <div className="quest-text">

                    <div className="quest-name">
                      출석체크
                    </div>

                    <div className="quest-reward">
                      +10 미네랄
                    </div>

                  </div>

                </Link>

                <Link
                  href="/games"
                  className="quest-item"
                >

                  <div className="quest-icon">
                    🎮
                  </div>

                  <div className="quest-text">

                    <div className="quest-name">
                      게임 참여
                    </div>

                    <div className="quest-reward">
                      게임 활동
                    </div>

                  </div>

                </Link>

                <Link
                  href="/board"
                  className="quest-item"
                >

                  <div className="quest-icon">
                    💬
                  </div>

                  <div className="quest-text">

                    <div className="quest-name">
                      커뮤니티 참여
                    </div>

                    <div className="quest-reward">
                      게시판 활동
                    </div>

                  </div>

                </Link>

              </div>

            </section>

            {/* 미네랄 로또 대응 */}

            <section className="home-section portal-section">

              <div className="section-title">

                <h2>🎟️ 미네랄 로또</h2>

                <Link
                  href="/games"
                  className="section-more"
                >
                  참여하기 〉
                </Link>

              </div>

              <div className="lotto-box">

                <div className="lotto-current">
                  현재 회차
                </div>

                <div className="lotto-number">
                  준비중
                </div>

                <div className="lotto-info">

                  <div className="lotto-row">
                    <span>누적 상금</span>
                    <b>준비중</b>
                  </div>

                  <div className="lotto-row">
                    <span>참여자</span>
                    <b>준비중</b>
                  </div>

                  <div className="lotto-row">
                    <span>최근 당첨자</span>
                    <b>준비중</b>
                  </div>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </div>
    </div>
  );
}