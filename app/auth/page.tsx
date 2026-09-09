"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Auth() {
  const supabase = createClient();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMsg(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname,
          },
        },
      });

      if (error) {
        setMsg(error.message);
      } else {
        setMsg(
          data.session
            ? "가입이 완료되었습니다."
            : "이메일 인증 후 로그인해주세요."
        );

        setMode("login");
      }
    }
  }

  return (
    <main
      style={{
        width: "100%",
        minHeight: "calc(100vh - 180px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "460px",

          background: "#0b0f15",
          border: "1px solid #252b34",
          borderRadius: "12px",

          padding: "32px",

          boxShadow:
            "0 12px 40px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* 로고 */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "34px",
              marginBottom: "8px",
            }}
          >
            ⛏️
          </div>

          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "26px",
              fontWeight: 800,
            }}
          >
            혜로로
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#737c88",
              fontSize: "13px",
            }}
          >
            {mode === "login"
              ? "혜로로에 로그인하세요."
              : "혜로로 회원이 되어보세요."}
          </p>
        </div>

        {/* 로그인 / 회원가입 탭 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            marginBottom: "24px",

            background: "#080b10",
            border: "1px solid #252b34",
            borderRadius: "8px",
            padding: "4px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMsg("");
            }}
            style={{
              minHeight: "38px",

              border: "none",
              borderRadius: "6px",

              background:
                mode === "login"
                  ? "#d6a928"
                  : "transparent",

              color:
                mode === "login"
                  ? "#111111"
                  : "#7f8792",

              fontSize: "13px",
              fontWeight: 700,

              cursor: "pointer",
            }}
          >
            로그인
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setMsg("");
            }}
            style={{
              minHeight: "38px",

              border: "none",
              borderRadius: "6px",

              background:
                mode === "signup"
                  ? "#d6a928"
                  : "transparent",

              color:
                mode === "signup"
                  ? "#111111"
                  : "#7f8792",

              fontSize: "13px",
              fontWeight: 700,

              cursor: "pointer",
            }}
          >
            회원가입
          </button>
        </div>

        {/* 회원가입 닉네임 */}
        {mode === "signup" && (
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#d9dde3",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              닉네임
            </label>

            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              style={{
                width: "100%",
                height: "44px",
                padding: "0 13px",

                background: "#0d1219",
                color: "#ffffff",

                border: "1px solid #303743",
                borderRadius: "8px",

                fontSize: "14px",
              }}
            />
          </div>
        )}

        {/* 이메일 */}
        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#d9dde3",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            이메일
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            style={{
              width: "100%",
              height: "44px",
              padding: "0 13px",

              background: "#0d1219",
              color: "#ffffff",

              border: "1px solid #303743",
              borderRadius: "8px",

              fontSize: "14px",
            }}
          />
        </div>

        {/* 비밀번호 */}
        <div style={{ marginBottom: "22px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#d9dde3",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            비밀번호
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            style={{
              width: "100%",
              height: "44px",
              padding: "0 13px",

              background: "#0d1219",
              color: "#ffffff",

              border: "1px solid #303743",
              borderRadius: "8px",

              fontSize: "14px",
            }}
          />
        </div>

        {/* 메시지 */}
        {msg && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 14px",

              background: "#11161e",
              border: "1px solid #303743",
              borderRadius: "8px",

              color: "#aeb4bd",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            {msg}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={submit}
          style={{
            width: "100%",
            height: "46px",

            background: "#d6a928",
            color: "#111111",

            border: "1px solid #d6a928",
            borderRadius: "8px",

            fontSize: "14px",
            fontWeight: 800,

            cursor: "pointer",
          }}
        >
          {mode === "login" ? "로그인" : "회원가입"}
        </button>

        {/* 하단 안내 */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "18px",

            borderTop: "1px solid #252b34",

            textAlign: "center",
            color: "#5f6874",
            fontSize: "12px",
          }}
        >
          ⛏️ 혜로로 커뮤니티
        </div>
      </section>
    </main>
  );
}