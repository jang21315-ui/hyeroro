"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    if (loading) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google Login Error:", error);
        alert("Google 로그인 중 오류가 발생했습니다.");
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

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            height: "50px",
            border: "1px solid #303946",
            borderRadius: "8px",
            background: "#fff",
            color: "#222",
            fontSize: "14px",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Google 로그인 중..." : "Google로 로그인"}
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
          Google 계정으로 혜로로에
          <br />
          간편하게 로그인할 수 있습니다.
        </p>
      </div>
    </main>
  );
}