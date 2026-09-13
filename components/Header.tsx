import Link from "next/link";
import { Great_Vibes } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import GoogleLoginButton from "./GoogleLoginButton";

const hyeroroFont = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
});

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
        <Link href="/" className="logo">
          <span className={hyeroroFont.className}>
            Hyeroro
          </span>
        </Link>

        <nav className="main-nav">
          <Link href="/">홈</Link>
          <Link href="/board">게시판</Link>
          <Link href="/ranking">랭킹</Link>
          <Link href="/shop">상점</Link>
          <Link href="/games">게임</Link>
        </nav>

        <div className="header-user">
          {user && profile ? (
            <>
              <div className="mineral">
                <span className="mineral-icon" />
                <span>
                  {Number(profile.minerals ?? 0).toLocaleString()}
                </span>
              </div>

              <Link href="/mypage" className="user-name">
                {profile.nickname}
              </Link>

              <LogoutButton />
            </>
          ) : (
            <GoogleLoginButton />
          )}
        </div>
      </div>
    </header>
  );
}