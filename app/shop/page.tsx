import { createClient } from "@/lib/supabase/server";
import ShopPurchaseButton from "@/components/ShopPurchaseButton";

type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
};

type Purchase = {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  shop_items:
    | {
        name: string;
        image_url: string | null;
      }
    | {
        name: string;
        image_url: string | null;
      }[]
    | null;
};

export default async function Shop() {
  const supabase = await createClient();

  // 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 판매 중인 상품 가져오기
  const { data: itemData } = await supabase
    .from("shop_items")
    .select("id, name, description, price, image_url")
    .eq("active", true)
    .order("created_at", { ascending: true });

  const items = (itemData ?? []) as ShopItem[];

  // 보유 미네랄
  let minerals = 0;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("minerals")
      .eq("id", user.id)
      .single();

    minerals = Number(profile?.minerals ?? 0);
  }

  // 구매 내역
  let purchases: Purchase[] = [];

  if (user) {
    const { data: purchaseData } = await supabase
      .from("shop_purchases")
      .select(
        `
          id,
          quantity,
          unit_price,
          total_price,
          created_at,
          shop_items (
            name,
            image_url
          )
        `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    purchases = (purchaseData ?? []) as Purchase[];
  }

  return (
    <main className="shop-page">
      <style>{`
        .shop-page {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 0 60px;
          box-sizing: border-box;
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 28px;
        }

        .shop-eyebrow {
          color: #d6a928;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .shop-title {
          margin: 0;
          color: #ffffff;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .shop-description {
          margin: 9px 0 0;
          color: #8b93a0;
          font-size: 14px;
        }

        .mineral-box {
          min-width: 190px;
          padding: 14px 18px;
          background: #111722;
          border: 1px solid #2a303a;
          border-radius: 10px;
          text-align: right;
          box-sizing: border-box;
        }

        .mineral-label {
          color: #7f8792;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .mineral-value {
          color: #d6a928;
          font-size: 19px;
          font-weight: 800;
        }

        .shop-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 20px;
          align-items: start;
        }

        .shop-products {
          background: #0b0f15;
          border: 1px solid #252b34;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          box-sizing: border-box;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .shop-card {
          overflow: hidden;
          background: #11161e;
          border: 1px solid #2a3039;
          border-radius: 12px;
          min-width: 0;
        }

        /*
          이미지 전체가 보이도록 contain 사용
        */
        .shop-image-wrap {
          position: relative;
          width: 100%;
          height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            145deg,
            #171321,
            #0d1017
          );
          border-bottom: 1px solid #292d36;
          overflow: hidden;
          box-sizing: border-box;
        }

        .shop-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
        }

        .signature-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 5px 9px;
          border-radius: 5px;
          background: #d6a928;
          color: #111111;
          font-size: 10px;
          font-weight: 800;
          z-index: 2;
        }

        .shop-card-info {
          padding: 17px;
        }

        .shop-card-title {
          margin: 0;
          color: #ffffff;
          font-size: 16px;
          font-weight: 750;
          line-height: 1.4;
        }

        .shop-card-description {
          min-height: 42px;
          margin: 9px 0 16px;
          color: #8a929e;
          font-size: 12px;
          line-height: 1.6;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 13px;
          border-top: 1px solid #292e37;
        }

        .price-label {
          color: #777f8b;
          font-size: 11px;
        }

        .price-value {
          color: #d6a928;
          font-size: 16px;
          font-weight: 800;
        }

        .shop-side {
          position: sticky;
          top: 20px;
          background: #0b0f15;
          border: 1px solid #252b34;
          border-radius: 14px;
          padding: 20px;
          box-sizing: border-box;
        }

        .side-title {
          margin: 0 0 18px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 800;
        }

        .login-box {
          padding: 30px 12px;
          text-align: center;
          border-top: 1px solid #252b34;
          border-bottom: 1px solid #252b34;
          color: #8a929e;
          font-size: 13px;
          line-height: 1.7;
        }

        .side-info {
          margin-top: 18px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          color: #858d99;
          font-size: 12px;
        }

        .info-value {
          color: #ffffff;
          font-weight: 700;
        }

        .info-mineral {
          color: #d6a928;
          font-weight: 800;
        }

        .history-section {
          margin-top: 20px;
          background: #0b0f15;
          border: 1px solid #252b34;
          border-radius: 14px;
          padding: 22px;
          box-sizing: border-box;
        }

        .history-title {
          margin: 0 0 18px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 800;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 13px 15px;
          background: #11161e;
          border: 1px solid #292f38;
          border-radius: 9px;
          box-sizing: border-box;
        }

        .history-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .history-image {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          object-fit: contain;
          object-position: center;
          border-radius: 7px;
          background: #191c25;
          border: 1px solid #343944;
        }

        .history-name {
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
        }

        .history-date {
          margin-top: 4px;
          color: #6f7783;
          font-size: 11px;
        }

        .history-price {
          flex-shrink: 0;
          color: #d6a928;
          font-size: 13px;
          font-weight: 800;
        }

        .empty-history {
          padding: 35px 10px;
          text-align: center;
          color: #68717d;
          font-size: 13px;
          border-top: 1px solid #252b34;
          border-bottom: 1px solid #252b34;
        }

        .empty-shop {
          padding: 70px 20px;
          text-align: center;
          color: #707985;
          font-size: 14px;
        }

        @media (max-width: 1000px) {
          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .shop-page {
            padding: 5px 12px 45px;
          }

          .shop-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .mineral-box {
            width: 100%;
            text-align: left;
          }

          .shop-layout {
            grid-template-columns: 1fr;
          }

          .shop-side {
            position: static;
          }

          .shop-products {
            padding: 14px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .shop-image-wrap {
            height: 250px;
          }

          .history-section {
            padding: 14px;
          }

          .history-item {
            align-items: flex-start;
          }

          .history-price {
            font-size: 12px;
          }
        }
      `}</style>

      {/* 상단 제목 */}
      <div className="shop-header">
        <div>
          <div className="shop-eyebrow">
            HYERORO SHOP
          </div>

          <h1 className="shop-title">
            🛒 상점
          </h1>

          <p className="shop-description">
            원하는 아이템을 미네랄로 구매할 수 있습니다.
          </p>
        </div>

        {/* 보유 미네랄 */}
        <div className="mineral-box">
          <div className="mineral-label">
            보유 미네랄
          </div>

          <div className="mineral-value">
            {user
              ? `⛏️ ${minerals.toLocaleString()}`
              : "로그인 필요"}
          </div>
        </div>
      </div>

      {/* 상점 */}
      <section className="shop-layout">
        {/* 상품 영역 */}
        <div className="shop-products">
          {items.length > 0 ? (
            <div className="products-grid">
              {items.map((item) => (
                <div
                  className="shop-card"
                  key={item.id}
                >
                  {/* 상품 이미지 */}
                  <div className="shop-image-wrap">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="shop-image"
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: "42px",
                        }}
                      >
                        🔊
                      </div>
                    )}

                    <span className="signature-badge">
                      시그니처 아이템
                    </span>
                  </div>

                  {/* 상품 정보 */}
                  <div className="shop-card-info">
                    <h3 className="shop-card-title">
                      {item.name}
                    </h3>

                    <p className="shop-card-description">
                      {item.description ||
                        "혜로로 상점의 특별한 아이템입니다."}
                    </p>

                    {/* 가격 */}
                    <div className="price-row">
                      <span className="price-label">
                        가격
                      </span>

                      <strong className="price-value">
                        ⛏️{" "}
                        {Number(
                          item.price
                        ).toLocaleString()}
                      </strong>
                    </div>

                    {/* 구매 버튼 */}
                    {user ? (
                      <ShopPurchaseButton
                        itemId={item.id}
                        itemName={item.name}
                        price={Number(item.price)}
                        minerals={minerals}
                      />
                    ) : (
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "11px 10px",
                          borderRadius: "7px",
                          background: "#252a31",
                          color: "#777f8b",
                          textAlign: "center",
                          fontSize: "13px",
                          fontWeight: 800,
                        }}
                      >
                        로그인 후 구매할 수 있습니다
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-shop">
              현재 판매 중인 아이템이 없습니다.
            </div>
          )}
        </div>

        {/* 오른쪽 내 미네랄 */}
        <aside className="shop-side">
          <h2 className="side-title">
            ⛏️ 내 미네랄
          </h2>

          {!user ? (
            <div className="login-box">
              로그인하면
              <br />
              보유 미네랄과 구매 내역을
              <br />
              확인할 수 있습니다.
            </div>
          ) : (
            <>
              <div className="login-box">
                현재 보유 미네랄

                <strong
                  style={{
                    display: "block",
                    marginTop: "8px",
                    color: "#d6a928",
                    fontSize: "24px",
                  }}
                >
                  ⛏️{" "}
                  {minerals.toLocaleString()}
                </strong>
              </div>

              <div className="side-info">
                <div className="info-row">
                  <span>판매 상품</span>

                  <strong className="info-value">
                    {items.length}개
                  </strong>
                </div>

                <div className="info-row">
                  <span>상품 가격</span>

                  <strong className="info-mineral">
                    ⛏️ 100
                  </strong>
                </div>

                <div className="info-row">
                  <span>구매 내역</span>

                  <strong className="info-value">
                    {purchases.length}건
                  </strong>
                </div>
              </div>
            </>
          )}
        </aside>
      </section>

      {/* 구매 내역 */}
      {user && (
        <section className="history-section">
          <h2 className="history-title">
            📜 구매 내역
          </h2>

          {purchases.length > 0 ? (
            <div className="history-list">
              {purchases.map((purchase) => {
                const product = Array.isArray(
                  purchase.shop_items
                )
                  ? purchase.shop_items[0]
                  : purchase.shop_items;

                return (
                  <div
                    className="history-item"
                    key={purchase.id}
                  >
                    <div className="history-left">
                      {product?.image_url ? (
                        <img
                          src={product.image_url}
                          alt={
                            product.name
                          }
                          className="history-image"
                        />
                      ) : (
                        <div className="history-image" />
                      )}

                      <div>
                        <div className="history-name">
                          {product?.name ||
                            "상품"}
                        </div>

                        <div className="history-date">
                          {new Date(
                            purchase.created_at
                          ).toLocaleString(
                            "ko-KR"
                          )}
                          {" · "}
                          {purchase.quantity}개
                        </div>
                      </div>
                    </div>

                    <div className="history-price">
                      - ⛏️{" "}
                      {Number(
                        purchase.total_price
                      ).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-history">
              아직 구매한 상품이 없습니다.
            </div>
          )}
        </section>
      )}
    </main>
  );
}