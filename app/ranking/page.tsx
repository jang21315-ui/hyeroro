import { createClient } from "@/lib/supabase/server";

export default async function Ranking() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("nickname, minerals")
    .order("minerals", { ascending: false })
    .limit(100);

  const rankings = data ?? [];

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
          🏆 미네랄 랭킹
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "#7f8792",
            fontSize: "14px",
          }}
        >
          미네랄을 가장 많이 보유한 회원 순위입니다.
        </p>
      </div>

      {/* 랭킹 카드 */}
      <section
        style={{
          background: "#0b0f15",
          border: "1px solid #252b34",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "90px 1fr 180px",
            alignItems: "center",
            minHeight: "52px",
            padding: "0 24px",
            background: "#0f141b",
            borderBottom: "1px solid #252b34",
            color: "#737c88",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <span>순위</span>
          <span>닉네임</span>
          <span
            style={{
              textAlign: "right",
            }}
          >
            미네랄
          </span>
        </div>

        {/* 랭킹 목록 */}
        {rankings.length > 0 ? (
          rankings.map((x: any, i: number) => {
            const rank = i + 1;

            let rankColor = "#8d96a3";

            if (rank === 1) {
              rankColor = "#ffd84d";
            } else if (rank === 2) {
              rankColor = "#c8d0da";
            } else if (rank === 3) {
              rankColor = "#cd9b6a";
            }

            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 180px",
                  alignItems: "center",
                  minHeight: "62px",
                  padding: "0 24px",
                  borderBottom:
                    i === rankings.length - 1
                      ? "none"
                      : "1px solid #1d232c",
                  transition: "background 0.2s",
                }}
              >
                {/* 순위 */}
                <div
                  style={{
                    color: rankColor,
                    fontSize: rank <= 3 ? "16px" : "14px",
                    fontWeight: 800,
                  }}
                >
                  {rank <= 3 && (
                    <span
                      style={{
                        marginRight: "5px",
                      }}
                    >
                      {rank === 1
                        ? "🥇"
                        : rank === 2
                        ? "🥈"
                        : "🥉"}
                    </span>
                  )}
                  {rank}위
                </div>

                {/* 닉네임 */}
                <div
                  style={{
                    color: "#f2f4f7",
                    fontSize: "15px",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {x.nickname}
                </div>

                {/* 미네랄 */}
                <div
                  style={{
                    textAlign: "right",
                    color: "#4fd1c5",
                    fontSize: "15px",
                    fontWeight: 800,
                  }}
                >
                  ⛏️ {x.minerals.toLocaleString()}
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              padding: "70px 20px",
              textAlign: "center",
              color: "#6f7782",
              fontSize: "14px",
            }}
          >
            아직 랭킹 데이터가 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}