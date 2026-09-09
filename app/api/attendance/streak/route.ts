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
          streak: 0,
        },
        { status: 401 }
      );
    }

    const { data: attendance, error } = await supabase
      .from("attendance")
      .select("attendance_date")
      .eq("user_id", user.id)
      .order("attendance_date", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Attendance Streak Error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "출석 기록을 불러오지 못했습니다.",
          streak: 0,
        },
        { status: 500 }
      );
    }

    const dates =
      attendance?.map(
        (item) => item.attendance_date
      ) ?? [];

    if (dates.length === 0) {
      return NextResponse.json({
        success: true,
        streak: 0,
      });
    }

    let streak = 0;

    const today = new Date();

    const todayString =
      today.toLocaleDateString("en-CA", {
        timeZone: "Asia/Seoul",
      });

    const yesterday = new Date(
      today.getTime() -
        24 * 60 * 60 * 1000
    );

    const yesterdayString =
      yesterday.toLocaleDateString("en-CA", {
        timeZone: "Asia/Seoul",
      });

    let currentDate: string;

    if (dates.includes(todayString)) {
      currentDate = todayString;
    } else if (
      dates.includes(yesterdayString)
    ) {
      currentDate = yesterdayString;
    } else {
      return NextResponse.json({
        success: true,
        streak: 0,
      });
    }

    while (
      dates.includes(currentDate)
    ) {
      streak++;

      const date = new Date(
        `${currentDate}T00:00:00+09:00`
      );

      date.setDate(
        date.getDate() - 1
      );

      currentDate =
        date.toLocaleDateString(
          "en-CA",
          {
            timeZone: "Asia/Seoul",
          }
        );
    }

    return NextResponse.json({
      success: true,
      streak,
    });
  } catch (error) {
    console.error(
      "Attendance Streak API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "연속 출석을 계산하는 중 오류가 발생했습니다.",
        streak: 0,
      },
      { status: 500 }
    );
  }
}