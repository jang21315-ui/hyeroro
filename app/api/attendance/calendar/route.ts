import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "로그인이 필요합니다.",
        },
        { status: 401 }
      );
    }

    const { data: attendance, error } = await supabase
      .from("attendance")
      .select("attendance_date")
      .eq("user_id", user.id)
      .order("attendance_date", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Attendance Calendar Error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "출석 기록을 불러오지 못했습니다.",
        },
        { status: 500 }
      );
    }

    const dates =
      attendance?.map(
        (item) => item.attendance_date
      ) ?? [];

    return NextResponse.json({
      success: true,
      dates,
      total: dates.length,
    });
  } catch (error) {
    console.error(
      "Attendance Calendar API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "출석 기록 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}