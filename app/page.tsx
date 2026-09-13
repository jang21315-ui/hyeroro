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

  const todayAttendanceCount = attendanceCount ?? 0;

  const recentPosts: Post[] = posts ?? [];
  const ranking: Profile[] = profiles ?? [];

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
    <>
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

        .home-card {
          width: 100%;
          overflow: hidden;

          background: #0b0f15;

          border: 1px solid #242b35;
          border-radius: 8px;

          box-shadow:
            0 8px 25px rgba(0, 0, 0, 0.12);
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

          font-size: 8px;
          font-weight: 700;

          text-decoration: none;

          transition:
            color 0.2s ease;
        }

        .card-more:hover {
          color: #d6a928;
        }


        /* ========================================
           메인 히어로
        ======================================== */

        .hero {
          position: relative;

          min-height: 185px;

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

          text-decoration: none;

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
           방송 공지
        ======================================== */

        .broadcast {
          margin-bottom: 10px;

          overflow: hidden;

          background:
            linear-gradient(
              100deg,
              #121820,
              #0b0f15
            );

          border: 1px solid #292f38;
          border-radius: 8px;
        }

        .broadcast-header {
          min-height: 42px;
          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid #242b34;
        }

        .