"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  currentNickname: string;
};

export default function NicknameForm({
  currentNickname,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [nickname, setNickname] = useState(currentNickname);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setMessage("");

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setMessage("닉네임을 입력해주세요.");
      return;
    }

    if (trimmedNickname.length < 2) {
      setMessage("닉네임은 2글자 이상 입력해주세요.");
      return;
    }

    if (trimmedNickname.length > 20) {
      setMessage("닉네임은 20글자 이하로 입력해주세요.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("로그인이 필요합니다.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        nickname: trimmedNickname,
      })
      .eq("id", user.id);

    if (error) {
      setMessage("닉네임 변경에 실패했습니다.");
      setSaving(false);
      return;
    }

    setNickname(trimmedNickname);
    setMessage("닉네임이 변경되었습니다.");
    setSaving(false);

    router.refresh();
  }

  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#d9dde3",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        새로운 닉네임
      </label>

      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
          maxLength={20}
          style={{
            flex: 1,
            minWidth: 0,
            height: "42px",
            padding: "0 12px",
            background: "#0d1219",
            color: "#ffffff",
            border: "1px solid #303743",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: "90px",
            height: "42px",
            border: "1px solid #d6a928",
            borderRadius: "8px",
            background: saving ? "#6f5a20" : "#d6a928",
            color: "#111111",
            fontSize: "12px",
            fontWeight: 800,
            cursor: saving ? "default" : "pointer",
          }}
        >
          {saving ? "저장 중" : "변경"}
        </button>
      </div>

      <p
        style={{
          margin: "8px 0 0",
          color: "#626b76",
          fontSize: "11px",
        }}
      >
        2~20글자로 입력해주세요.
      </p>

      {message && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 12px",
            background: "#11161e",
            border: "1px solid #303743",
            borderRadius: "7px",
            color: "#aeb4bd",
            fontSize: "12px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}