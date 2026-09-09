import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import NicknameForm from "@/components/NicknameForm";

export default async function MyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main style={{ width: "100%" }}>
        <section
          style={{
            background: "#0b0f15",
            border: "1px solid #252b34",
            borderRadius: "12px",
            padding: "60px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "40px",
              marginBottom: "16px",
            }}
          >
            🔒
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            로그인이 필요합니다
          </h1>

          <p
            style={{
              margin: "10px 0 24px",
              color: "#7f8792",
              fontSize: "14px",
            }}
          >
            마이페이지를 이용하려면 로그인해주세요.
          </p>

          <Link href="/auth" className="btn">
            로그인 / 회원가입
          </Link>
        </section>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, minerals")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return (
      <main style={{ width: "100%" }}>
        <section
          style={{
            background: "#0b0f15",
            border: "1px solid #252b34",
            borderRadius: "12px",
            padding: "60px 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            프로필을 찾을 수 없습니다
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#7f8792",
              fontSize: "14px",
            }}
          >
            회원 프로필 정보가 아직 생성되지 않았습니다.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main style={{ width: "100%" }}>
      {/* 페이지 제목 */}
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          👤 마이페이지
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "#7f8792",
            fontSize: "14px",
          }}
        >
          내 혜로로 계정 정보를 확인할 수 있습니다.
        </p>
      </div>

      {/* 프로필 */}
      <section
        style={{
          background: "#0b0f15",
          border: "1px solid #252b34",
          borderRadius: "12px",
          padding: "28px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* 프로필 아이콘 */}
          <div
            style={{
              width: "72px",
              height: "72px",
              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background: "#111820",
              border: "1px solid #343b46",
              borderRadius: "50%",

              fontSize: "30px",
            }}
          >
            👤
          </div>

          {/* 닉네임 */}
          <div>
            <div
              style={{
                color: "#737c88",
                fontSize: "12px",
                marginBottom: "5px",
              }}
            >
              닉네임
            </div>

            <div
              style={{
                color: "#ffffff",
                fontSize: "21px",
                fontWeight: 800,
              }}
            >
              {profile.nickname}
            </div>
          </div>
        </div>
      </section>

      {/* 닉네임 변경 */}
      <section
        style={{
          background: "#0b0f15",
          border: "1px solid #252b34",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
          marginBottom: "18px",
        }}
      >
        <h2
          style={{
            margin: "0 0 18px",
            fontSize: "17px",
            fontWeight: 800,
          }}
        >
          닉네임 변경
        </h2>

        <NicknameForm currentNickname={profile.nickname} />
      </section>

      {/* 미네랄 */}
      <section
        style={{
          background: "#0b0f15",
          border: "1px solid #252b34",
          borderRadius: "12px",
          padding: "28px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            color: "#737c88",
            fontSize: "13px",
            marginBottom: "10px",
          }}
        >
          보유 미네랄
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
          }}
        >
          <span
            style={{
              color: "#4fd1c5",
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            ⛏️ {profile.minerals.toLocaleString()}
          </span>

          <span
            style={{
              color: "#7f8792",
              fontSize: "14px",
            }}
          >
            미네랄
          </span>
        </div>
      </section>

      {/* 계정 정보 */}
      <section
        style={{
          background: "#0b0f15",
          border: "1px solid #252b34",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: "17px",
            fontWeight: 800,
          }}
        >
          계정 정보
        </h2>

        <div
          style={{
            padding: "15px 0",
            borderTop: "1px solid #252b34",
          }}
        >
          <div
            style={{
              color: "#737c88",
              fontSize: "12px",
              marginBottom: "6px",
            }}
          >
            이메일
          </div>

          <div
            style={{
              color: "#d9dde3",
              fontSize: "14px",
            }}
          >
            {user.email ?? "이메일 정보 없음"}
          </div>
        </div>

        <div
          style={{
            padding: "15px 0",
            borderTop: "1px solid #252b34",
          }}
        >
          <div
            style={{
              color: "#737c88",
              fontSize: "12px",
              marginBottom: "6px",
            }}
          >
            회원 ID
          </div>

          <div
            style={{
              color: "#7f8792",
              fontSize: "12px",
              wordBreak: "break-all",
            }}
          >
            {user.id}
          </div>
        </div>
      </section>
    </main>
  );
}