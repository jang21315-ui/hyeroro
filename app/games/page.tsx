"use client";

import { useState } from "react";

export default function Games() {
  const [n, setN] = useState<number | null>(null);

  const play = () => {
    setN(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <main
      style={{
        width: "100%",
      }}
    >
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
          🎮 미네랄 게임
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "#7f8792",
            fontSize: "14px",
          }}
        >
          가볍게 즐길 수 있는 혜로로 미니게임입니다.
        </p>
      </div>

      {/* 게임 영역 */}
      <section
        style={{
          background: "#0b0f15",
          border: "1px solid #252b34",
          borderRadius: "12px",
          padding: "28px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            padding: "24px",

            background: "#0f141b",
            border: "1px solid #252b34",
            borderRadius: "10px",

            textAlign: "center",
          }}
        >
          {/* 게임 이름 */}
          <div
            style={{
              marginBottom: "8px",
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            🎲 주사위
          </div>

          <p
            style={{
              margin: "0 0 24px",
              color: "#737c88",
              fontSize: "13px",
            }}
          >
            버튼을 눌러 주사위를 굴려보세요.
          </p>

          {/* 주사위 결과 */}
          <div
            style={{
              width: "120px",
              height: "120px",
              margin: "0 auto 24px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background: "#080b10",
              border: "1px solid #343b46",
              borderRadius: "14px",

              color: n === null ? "#555e6c" : "#ffd84d",
              fontSize: "58px",
              fontWeight: 800,

              boxShadow:
                "inset 0 0 20px rgba(0, 0, 0, 0.35)",
            }}
          >
            {n ?? "?"}
          </div>

          {/* 굴리기 버튼 */}
          <button
            type="button"
            onClick={play}
            style={{
              width: "100%",
              minHeight: "44px",

              border: "1px solid #d6a928",
              borderRadius: "8px",

              background: "#d6a928",
              color: "#111111",

              fontSize: "15px",
              fontWeight: 800,

              cursor: "pointer",
              transition:
                "background 0.2s, transform 0.2s",
            }}
          >
            🎲 주사위 굴리기
          </button>
        </div>

        {/* 안내 */}
        <div
          style={{
            marginTop: "20px",
            padding: "14px 16px",

            background: "#0d1219",
            border: "1px solid #202630",
            borderRadius: "8px",

            color: "#6f7782",
            fontSize: "12px",
            lineHeight: 1.6,
          }}
        >
          💡 현재 주사위 게임은 비환금성 미니게임입니다.
          <br />
          실제 미네랄이 차감되거나 지급되지는 않습니다.
        </div>
      </section>
    </main>
  );
}