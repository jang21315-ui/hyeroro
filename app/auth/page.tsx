"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (mode === "signup" && !nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert(error.message);
          return;
        }

        window.location.href = "/";
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname.trim(),
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session) {
        window.location.href = "/";
      } else {
        alert(
          "회원가입이 완료되었습니다. 이메일 인증이 필요한 경우 이메일을 확인해주세요."
        );
        setMode("login");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google 로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "#080b10",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          padding: "32px",
          borderRadius: "14px",
          background: "#11161d",
          border: "1px solid #252d38",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#d6a928",
              fontSize: "30px",
              fontWeight: 900,
            }}
          >
            HYE RORO
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#8f9baa",
              fontSize: "13px",
            }}
          >
            혜로로 커뮤니티
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "22px",
          }}
        >
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{
              height: "42px",
              border: "1px solid #303946",
              borderRadius: "8px",
              background:
                mode === "login" ? "#d6a928" : "#171d25",
              color: mode === "login" ? "#111" : "#aeb7c3",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            로그인
          </button>

          <button
            type="button"
            onClick={() => setMode("signup")}
            style={{
              height: "42px",
              border: "1px solid #303946",
              borderRadius: "8px",
              background:
                mode === "signup" ? "#d6a928" : "#171d25",
              color: mode === "signup" ? "#111" : "#aeb7c3",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#d7dde5",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                닉네임
              </label>

              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 13px",
                  boxSizing: "border-box",
                  border: "1px solid #303946",
                  borderRadius: "8px",
                  outline: "none",
                  background: "#0b1016",
                  color: "#fff",
                  fontSize: "14px",
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#d7dde5",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              이메일
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              style={{
                width: "100%",
                height: "46px",
                padding: "0 13px",
                boxSizing: "border-box",
                border: "1px solid #303946",
                borderRadius: "8px",
                outline: "none",
                background: "#0b1016",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#d7dde5",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              비밀번호
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete={
                mode === "login"
                  ? "current-password"
                  : "new-password"
              }
              style={{
                width: "100%",
                height: "46px",
                padding: "0 13px",
                boxSizing: "border-box",
                border: "1px solid #303946",
                borderRadius: "8px",
                outline: "none",
                background: "#0b1016",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              border: "none",
              borderRadius: "8px",
              background: loading ? "#66531d" : "#d6a928",
              color: "#111",
              fontSize: "14px",
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "처리 중..."
              : mode === "login"
                ? "로그인"
                : "회원가입"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "22px 0",
            color: "#596473",
            fontSize: "12px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#29313c",
            }}
          />
          <span>또는</span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#29313c",
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            height: "48px",
            border: "1px solid #303946",
            borderRadius: "8px",
            background: "#fff",
            color: "#222",
            fontSize: "14px",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Google로 로그인
        </button>

        <p
          style={{
            margin: "20px 0 0",
            textAlign: "center",
            color: "#687482",
            fontSize: "11px",
            lineHeight: 1.6,
          }}
        >
          Google 계정으로도 간편하게 가입하고
          <br />
          로그인할 수 있습니다.
        </p>
      </div>
    </main>
  );
}