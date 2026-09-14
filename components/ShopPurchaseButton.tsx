"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  itemId: string;
  itemName: string;
  price: number;
  minerals: number;
  onPurchased?: (remainingMinerals: number) => void;
};

export default function ShopPurchaseButton({
  itemId,
  itemName,
  price,
  minerals,
  onPurchased,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    if (loading) return;

    if (minerals < price) {
      alert(
        `미네랄이 부족합니다.\n\n필요 미네랄: ${price.toLocaleString()}\n보유 미네랄: ${minerals.toLocaleString()}`
      );
      return;
    }

    const confirmed = window.confirm(
      `"${itemName}"을(를) 구매하시겠습니까?\n\n가격: ⛏️ ${price.toLocaleString()} 미네랄`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "purchase_shop_item",
        {
          p_shop_item_id: itemId,
          p_quantity: 1,
        }
      );

      if (error) {
        console.error(error);
        alert(`구매에 실패했습니다.\n\n${error.message}`);
        return;
      }

      const result = Array.isArray(data) ? data[0] : data;

      if (!result?.success) {
        alert(result?.error || "구매에 실패했습니다.");
        return;
      }

      const remainingMinerals = Number(result.remaining_minerals ?? 0);

      alert(
        `구매가 완료되었습니다! 🎉\n\n` +
          `상품: ${result.item_name || itemName}\n` +
          `수량: ${result.quantity || 1}개\n` +
          `사용 미네랄: ⛏️ ${Number(
            result.total_price ?? price
          ).toLocaleString()}\n` +
          `남은 미네랄: ⛏️ ${remainingMinerals.toLocaleString()}`
      );

      onPurchased?.(remainingMinerals);

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("구매 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePurchase}
      disabled={loading}
      style={{
        width: "100%",
        marginTop: "10px",
        padding: "11px 10px",
        border: "none",
        borderRadius: "7px",
        background: loading ? "#555b63" : "#d6a928",
        color: loading ? "#d0d4da" : "#111111",
        fontSize: "13px",
        fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "0.2s",
      }}
    >
      {loading
        ? "구매 처리 중..."
        : `⛏️ ${price.toLocaleString()} 미네랄 구매`}
    </button>
  );
}