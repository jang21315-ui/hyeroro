"use client";

import { createClient } from "@/lib/supabase/client";

export default function GoogleLoginButton() {
  async function loginWithGoogle() {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <button
      type="button"
      onClick={loginWithGoogle}
      style={{
        height: "36px",
        padding: "0 16px",
        border: "none",
        borderRadius: "7px",
        background: "#ff2f92",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: 800,
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 12px rgba(255, 47, 146, 0.25)",
      }}
    >
      구글 로그인
    </button>
  );
}