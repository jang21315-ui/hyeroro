import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
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

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Seoul",
    });

    // 오늘 이미 출석했는지 확인
    const { data: existingAttendance, error: checkError } =
      await supabase
        .from("attendance")
        .select("id")
        .eq("user_id", user.id)
        .eq("attendance_date", today)
        .maybeSingle();

    if (checkError) {
      console.error("Attendance Check Error:", checkError);

      return NextResponse.json(
        {
          success: false,
          message: "출석 상태 확인에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    // 이미 출석한 경우
    if (existingAttendance) {
      return NextResponse.json({
        success: false,
        alreadyChecked: true,
        message: "오늘은 이미 출석했습니다.",
      });
    }

    // 출석 기록 생성
    const { error: attendanceError } = await supabase
      .from("attendance")
      .insert({
        user_id: user.id,
        attendance_date: today,
      });

    if (attendanceError) {
      // UNIQUE 제약조건에 걸린 경우
      // 다른 요청에서 먼저 출석 처리된 것으로 판단
      if (
        attendanceError.code === "23505"
      ) {
        return NextResponse.json({
          success: false,
          alreadyChecked: true,
          message: "오늘은 이미 출석했습니다.",
        });
      }

      console.error(
        "Attendance Insert Error:",
        attendanceError
      );

      return NextResponse.json(
        {
          success: false,
          message: "출석 처리에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    const attendanceReward = 10;

    // 현재 미네랄 조회
    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("minerals")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
      console.error(
        "Profile Fetch Error:",
        profileError
      );

      return NextResponse.json({
        success: true,
        message:
          "출석은 완료되었지만 미네랄 지급에 실패했습니다.",
        reward: 0,
      });
    }

    const newMinerals =
      (profile.minerals ?? 0) + attendanceReward;

    // 미네랄 지급
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        minerals: newMinerals,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error(
        "Mineral Update Error:",
        updateError
      );

      return NextResponse.json({
        success: true,
        message:
          "출석은 완료되었지만 미네랄 지급에 실패했습니다.",
        reward: 0,
      });
    }

    return NextResponse.json({
      success: true,
      alreadyChecked: false,
      message: "출석체크가 완료되었습니다!",
      reward: attendanceReward,
      minerals: newMinerals,
    });
  } catch (error) {
    console.error(
      "Attendance API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "출석 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}