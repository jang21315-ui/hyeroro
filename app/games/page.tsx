"use client";

import { useState } from "react";

type Choice = "홀" | "짝" | null;

export default function Games() {
  const [choice, setChoice] = useState<Choice>(null);
  const [bet, setBet] = useState("");
  const [dice, setDice] = useState<number | null>(null);
  const [message, setMessage] = useState(
    "홀/짝을 선택하고 주사위를 던져보세요."
  );
  const [isRolling, setIsRolling] = useState(false);

  const minerals = 0;

  const play = () => {
    if (!choice) {
      setMessage("먼저 홀 또는 짝을 선택해주세요.");
      return;
    }

    const amount = Number(bet);

    if (!amount || amount <= 0) {
      setMessage("베팅할 미네랄을 입력해주세요.");
      return;
    }

    if (amount > 10000) {
      setMessage("한 번에 최대 10,000 미네랄까지 베팅할 수 있습니다.");
      return;
    }

    setIsRolling(true);
    setMessage("주사위를 굴리는 중입니다...");
    setDice(null);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      const resultType: Choice = result % 2 === 0 ? "짝" : "홀";

      setDice(result);

      if (resultType === choice) {
        const reward = Math.floor(amount * 1.9);

        setMessage(
          `🎉 성공! ${result}가 나왔습니다. +${reward.toLocaleString()} 미네랄`
        );
      } else {
        setMessage(
          `😢 실패! ${result}가 나왔습니다. 베팅한 ${amount.toLocaleString()} 미네랄을 잃었습니다.`
        );
      }

      setIsRolling(false);
    }, 900);
  };

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        paddingBottom: "40px",
      }}
    >
      {/* 상단 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div>
          <div
            style={{
              color: "#d6a928",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            HYERORO GAME
          </div>

          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "-1px",
            }}
          >
            🎲 미네랄 홀짝 게임
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#7f8792",
              fontSize: "14px",
            }}
          >
            미네랄을 걸고 주사위의 홀짝을 맞혀보세요.
          </p>
        </div>

        {/* 보유 미네랄 */}
        <div
          style={{
            minWidth: "180px",
            padding: "14px 18px",
            background: "#111720",
            border: "1px solid #2b323c",
            borderRadius: "10px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              color: "#737c88",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            보유 미네랄
          </div>

          <div
            style={{
              color: "#ffd84d",
              fontSize: "20px",
              fontWeight: 900,
            }}
          >
            ⛏️ {minerals.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 배당 정보 */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <InfoCard
          title="1차 성공"
          value="1.9배"
          sub="베팅 금액 기준"
        />

        <InfoCard
          title="연속 성공"
          value="준비 중"
          sub="추후 업데이트"
        />

        <InfoCard
          title="실패"
          value="0개"
          sub="베팅 미네랄 소진"
        />
      </section>

      {/* 메인 게임 + 랭킹 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 280px",
          gap: "18px",
          alignItems: "start",
        }}
      >
        {/* 게임 */}
        <section
          style={{
            background: "#0b0f15",
            border: "1px solid #252b34",
            borderRadius: "14px",
            padding: "28px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: 900,
              }}
            >
              주사위 홀짝
            </div>

            <div
              style={{
                marginTop: "7px",
                color: "#69727e",
                fontSize: "13px",
              }}
            >
              홀 또는 짝을 선택하고 미네랄을 베팅하세요.
            </div>
          </div>

          {/* 주사위 */}
          <div
            style={{
              width: "150px",
              height: "150px",
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "radial-gradient(circle at 35% 30%, #252c37 0%, #10151d 55%, #080b10 100%)",
              border: "1px solid #39414d",
              borderRadius: "20px",
              color: dice === null ? "#4e5865" : "#ffd84d",
              fontSize: "64px",
              fontWeight: 900,
              boxShadow:
                "inset 0 0 30px rgba(0,0,0,0.45), 0 12px 35px rgba(0,0,0,0.25)",
              transform: isRolling ? "rotate(8deg) scale(1.04)" : "none",
              transition: "transform 0.15s ease",
            }}
          >
            {dice ?? "?"}
          </div>

          {/* 안내 */}
          <div
            style={{
              marginBottom: "16px",
              textAlign: "center",
              color: "#aeb5be",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {message}
          </div>

          {/* 홀짝 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <button
              type="button"
              onClick={() => setChoice("홀")}
              style={{
                minHeight: "52px",
                border:
                  choice === "홀"
                    ? "2px solid #d6a928"
                    : "1px solid #343b46",
                borderRadius: "9px",
                background:
                  choice === "홀" ? "#29230e" : "#11161d",
                color:
                  choice === "홀" ? "#ffd84d" : "#aeb5be",
                fontSize: "16px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              홀
            </button>

            <button
              type="button"
              onClick={() => setChoice("짝")}
              style={{
                minHeight: "52px",
                border:
                  choice === "짝"
                    ? "2px solid #d6a928"
                    : "1px solid #343b46",
                borderRadius: "9px",
                background:
                  choice === "짝" ? "#29230e" : "#11161d",
                color:
                  choice === "짝" ? "#ffd84d" : "#aeb5be",
                fontSize: "16px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              짝
            </button>
          </div>

          {/* 베팅 */}
          <input
            type="number"
            min="1"
            max="10000"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            placeholder="베팅 미네랄 입력 (최대 10,000)"
            style={{
              width: "100%",
              height: "48px",
              boxSizing: "border-box",
              padding: "0 14px",
              marginBottom: "10px",
              background: "#080b10",
              border: "1px solid #343b46",
              borderRadius: "8px",
              outline: "none",
              color: "#ffffff",
              fontSize: "14px",
            }}
          />

          {/* 게임 버튼 */}
          <button
            type="button"
            onClick={play}
            disabled={isRolling}
            style={{
              width: "100%",
              minHeight: "50px",
              border: "1px solid #d6a928",
              borderRadius: "8px",
              background: isRolling ? "#62511c" : "#d6a928",
              color: "#111111",
              fontSize: "15px",
              fontWeight: 900,
              cursor: isRolling ? "default" : "pointer",
            }}
          >
            {isRolling ? "🎲 주사위 굴리는 중..." : "🎲 주사위 던지기"}
          </button>

          {/* 설명 */}
          <div
            style={{
              marginTop: "18px",
              padding: "13px 15px",
              background: "#0d1219",
              border: "1px solid #202630",
              borderRadius: "8px",
              color: "#69727e",
              fontSize: "12px",
              lineHeight: 1.7,
            }}
          >
            💡 홀은 1·3·5, 짝은 2·4·6입니다.
            <br />
            성공하면 베팅 금액의 1.9배를 획득합니다.
            <br />
            현재 화면은 게임 UI 단계이며 실제 미네랄 차감/지급은 다음 단계에서 연결합니다.
          </div>
        </section>

        {/* 랭킹 */}
        <aside
          style={{
            background: "#0b0f15",
            border: "1px solid #252b34",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div
            style={{
              marginBottom: "16px",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: 900,
            }}
          >
            🏆 게임 랭킹
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                padding: "8px",
                background: "#24200f",
                borderRadius: "6px",
                color: "#ffd84d",
                fontSize: "12px",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              미네랄
            </div>

            <div
              style={{
                padding: "8px",
                background: "#151a21",
                borderRadius: "6px",
                color: "#727b87",
                fontSize: "12px",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              게임
            </div>
          </div>

          <div
            style={{
              padding: "28px 10px",
              textAlign: "center",
              color: "#555e6c",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            아직 게임 랭킹이 없습니다.
            <br />
            게임을 플레이해보세요.
          </div>
        </aside>
      </div>

      {/* 게임 하이라이트 */}
      <section
        style={{
          marginTop: "18px",
          padding: "20px",
          background: "#111720",
          border: "1px solid #252b34",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            color: "#d6a928",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1px",
            marginBottom: "8px",
          }}
        >
          GAME HIGHLIGHT
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 800,
          }}
        >
          🎲 혜로로 홀짝 게임에서 행운의 주사위를 굴려보세요!
        </div>

        <div
          style={{
            marginTop: "7px",
            color: "#707986",
            fontSize: "12px",
          }}
        >
          성공하면 베팅 금액의 1.9배 미네랄을 획득할 수 있습니다.
        </div>
      </section>

      {/* 메인으로 */}
      <div
        style={{
          marginTop: "22px",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "42px",
            padding: "0 18px",
            border: "1px solid #303743",
            borderRadius: "8px",
            background: "#111720",
            color: "#aeb5be",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          ← 메인으로
        </a>
      </div>

      {/* 모바일 대응 */}
      <style jsx>{`
        @media (max-width: 800px) {
          main {
            padding-left: 12px;
            padding-right: 12px;
          }

          main > div:first-child {
            flex-direction: column;
            align-items: stretch !important;
          }

          main > div:nth-of-type(2) {
            grid-template-columns: 1fr !important;
          }

          main section:first-child {
            padding: 20px !important;
          }
        }

        @media (max-width: 560px) {
          main > section:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function InfoCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      style={{
        padding: "16px 18px",
        background: "#111720",
        border: "1px solid #252b34",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          color: "#707986",
          fontSize: "12px",
          marginBottom: "7px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#ffd84d",
          fontSize: "19px",
          fontWeight: 900,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: "4px",
          color: "#59616d",
          fontSize: "11px",
        }}
      >
        {sub}
      </div>
    </div>
  );
}