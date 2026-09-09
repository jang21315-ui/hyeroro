import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("nickname, minerals")
      .eq("id", user.id)
      .single();

    profile = data;
  }

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* 로고 */}
        <Link href="/" className="logo">
          ⛏️ 혜로로
        </Link>

        {/* 메인 메뉴 */}
        <nav className="main-nav">

          <Link href="/">
            홈
          </Link>

          <Link href="/board">
            게시판
          </Link>

          <Link href="/ranking">
            랭킹
          </Link>

          <Link href="/shop">
            상점
          </Link>

          <Link href="/games">
            게임
          </Link>

        </nav>

        {/* 오른쪽 사용자 영역 */}
        <div className="header-user">

          {user && profile ? (
            <>
              {/* 미네랄 */}
              <div className="mineral">
                ⛏️ {profile.minerals.toLocaleString()}
              </div>

              {/* 닉네임 */}
              <Link
                href="/mypage"
                className="user-name"
              >
                {profile.nickname}
              </Link>

              {/* 로그아웃 */}
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/auth"
              className="user-name"
            >
              로그인
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}