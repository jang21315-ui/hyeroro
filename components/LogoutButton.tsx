"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        minHeight: "36px",
        padding: "0 12px",

        background: "#11161e",
        color: "#aeb4bd",

        border: "1px solid #303743",
        borderRadius: "7px",

        fontSize: "12px",
        fontWeight: 600,

        cursor: "pointer",

        transition:
          "background 0.2s, color 0.2s, border-color 0.2s",
      }}
    >
      로그아웃
    </button>
  );
}