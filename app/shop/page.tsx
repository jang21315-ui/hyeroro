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
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "10px 0 60px",
      }}
    >
      {/* 상단 제목 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        <div>
          <div
            style={{
              color: "#d6a928",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            HYERORO SHOP
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.8px",
            }}
          >
            🛒 상점
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              color: "#8b93a0",
              fontSize: "14px",
            }}
          >
            원하는 아이템을 미네랄로 구매할 수 있습니다.
          </p>
        </div>

        {/* 보유 미네랄 */}
        <div
          style={{
            minWidth: "170px",
            padding: "14px 18px",
            background: "#111722",
            border: "1px solid #2a303a",
            borderRadius: "10px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              color: "#7f8792",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            보유 미네랄
          </div>

          <strong
            style={{
              color: "#d6a928",
              fontSize: "19px",
              fontWeight: 800,
            }}
          >
            ⛏️ 미네랄
          </strong>
        </div>
      </div>

      {/* 상점 전체 */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* 상품 영역 */}
        <div
          style={{
            background: "#0b0f15",
            border: "1px solid #252b34",
            borderRadius: "14px",
            padding: "22px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          }}
        >
          {items.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: "16px",
              }}
            >
              {items.map((x: any) => (
                <div
                  key={x.id}
                  style={{
                    overflow: "hidden",
                    background: "#11161e",
                    border: "1px solid #2a3039",
                    borderRadius: "12px",
                  }}
                >
                  {/* 상품 이미지 영역 */}
                  <div
                    style={{
                      position: "relative",
                      height: "210px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(145deg, #171321, #0d1017)",
                      borderBottom: "1px solid #292d36",
                    }}
                  >
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#191c25",
                        border: "1px solid #343944",
                        fontSize: "42px",
                      }}
                    >
                      🔊
                    </div>

                    {/* 시그니처 아이템 표시 */}
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        padding: "5px 9px",
                        borderRadius: "5px",
                        background: "#d6a928",
                        color: "#111111",
                        fontSize: "10px",
                        fontWeight: 800,
                      }}
                    >
                      시그니처 아이템
                    </span>
                  </div>

                  {/* 상품 정보 */}
                  <div
                    style={{
                      padding: "17px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: "#ffffff",
                        fontSize: "16px",
                        fontWeight: 750,
                      }}
                    >
                      {x.name}
                    </h3>

                    <p
                      style={{
                        minHeight: "42px",
                        margin: "9px 0 16px",
                        color: "#8a929e",
                        fontSize: "12px",
                        lineHeight: 1.6,
                      }}
                    >
                      {x.description || "혜로로 방송에서 사용되는 특별한 아이템입니다."}
                    </p>

                    {/* 가격 */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "13px",
                        borderTop: "1px solid #292e37",
                      }}
                    >
                      <span
                        style={{
                          color: "#777f8b",
                          fontSize: "11px",
                        }}
                      >
                        가격
                      </span>

                      <strong
                        style={{
                          color: "#d6a928",
                          fontSize: "16px",
                          fontWeight: 800,
                        }}
                      >
                        ⛏️ {Number(x.price).toLocaleString()}
                      </strong>
                    </div>

                    {/* 수량 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "14px",
                        padding: "7px",
                        background: "#0c1016",
                        borderRadius: "7px",
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          width: "28px",
                          height: "28px",
                          border: "1px solid #343943",
                          borderRadius: "5px",
                          background: "#171c24",
                          color: "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>

                      <span
                        style={{
                          color: "#ffffff",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        1
                      </span>

                      <button
                        type="button"
                        style={{
                          width: "28px",
                          height: "28px",
                          border: "1px solid #343943",
                          borderRadius: "5px",
                          background: "#171c24",
                          color: "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* 장바구니 버튼 */}
                    <button
                      type="button"
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        padding: "11px 10px",
                        border: "none",
                        borderRadius: "7px",
                        background: "#d6a928",
                        color: "#111111",
                        fontSize: "13px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      🛒 장바구니에 담기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "80px 20px",
                textAlign: "center",
                color: "#707985",
                fontSize: "14px",
              }}
            >
              현재 판매 중인 아이템이 없습니다.
            </div>
          )}
        </div>

        {/* 장바구니 */}
        <aside
          style={{
            position: "sticky",
            top: "20px",
            background: "#0b0f15",
            border: "1px solid #252b34",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <h2
            style={{
              margin: "0 0 18px",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 800,
            }}
          >
            🛒 장바구니
          </h2>

          <div
            style={{
              padding: "38px 10px",
              textAlign: "center",
              borderTop: "1px solid #252b34",
              borderBottom: "1px solid #252b34",
              color: "#68717d",
              fontSize: "13px",
            }}
          >
            장바구니가 비어 있습니다.
          </div>

          {/* 결제 정보 */}
          <div
            style={{
              marginTop: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "#858d99",
                fontSize: "12px",
              }}
            >
              <span>총 수량</span>
              <strong style={{ color: "#ffffff" }}>
                0개
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "#858d99",
                fontSize: "12px",
              }}
            >
              <span>총 결제 금액</span>
              <strong style={{ color: "#d6a928" }}>
                ⛏️ 0
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "14px",
                borderTop: "1px solid #252b34",
                color: "#858d99",
                fontSize: "12px",
              }}
            >
              <span>보유 미네랄</span>
              <strong style={{ color: "#ffffff" }}>
                ⛏️ -
              </strong>
            </div>
          </div>

          <button
            type="button"
            disabled
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "13px 10px",
              border: "none",
              borderRadius: "8px",
              background: "#252a31",
              color: "#666d77",
              fontSize: "13px",
              fontWeight: 800,
              cursor: "not-allowed",
            }}
          >
            ⛏️ 0 미네랄 결제하기
          </button>
        </aside>
      </section>
    </main>
  );
}