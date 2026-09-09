import { createClient } from "@/lib/supabase/server";

export default async function Shop() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("shop_items")
    .select("*")
    .eq("active", true)
    .order("price");

  const items = data ?? [];

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
          🛒 미네랄 상점
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "#7f8792",
            fontSize: "14px",
          }}
        >
          미네랄로 다양한 아이템을 구매할 수 있습니다.
        </p>
      </div>

      {/* 상점 카드 */}
      <section
        style={{
          background: "#0b0f15",
          border: "1px solid #252b34",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
        {items.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {items.map((x: any) => (
              <div
                key={x.id}
                style={{
                  minHeight: "190px",
                  padding: "20px",

                  display: "flex",
                  flexDirection: "column",

                  background: "#0f141b",
                  border: "1px solid #252b34",
                  borderRadius: "10px",

                  transition:
                    "border-color 0.2s, transform 0.2s",
                }}
              >
                {/* 아이템 이름 */}
                <h3
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize: "17px",
                    fontWeight: 700,
                  }}
                >
                  {x.name}
                </h3>

                {/* 설명 */}
                <p
                  style={{
                    margin: "12px 0 20px",
                    color: "#858e9a",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {x.description}
                </p>

                {/* 가격 */}
                <div
                  style={{
                    paddingTop: "14px",
                    borderTop: "1px solid #252b34",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "#6f7782",
                      fontSize: "12px",
                    }}
                  >
                    가격
                  </span>

                  <strong
                    style={{
                      color: "#4fd1c5",
                      fontSize: "16px",
                      fontWeight: 800,
                    }}
                  >
                    ⛏️ {x.price.toLocaleString()}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "70px 20px",
              textAlign: "center",
              color: "#6f7782",
              fontSize: "14px",
            }}
          >
            현재 판매 중인 아이템이 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}