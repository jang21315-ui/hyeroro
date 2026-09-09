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
          checked: false,
          minerals: 0,
        },
        { status: 401 }
      );
    }

    const today = new Date().toLocaleDateString(
      "en-CA",
      {
        timeZone: "Asia/Seoul",
      }
    );

    const { data: attendance } = await supabase
      .from("attendance")
      .select("id")
      .eq("user_id", user.id)
      .eq("attendance_date", today)
      .maybeSingle();

    const { data: profile } = await supabase
      .from("profiles")
      .select("minerals")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      checked: !!attendance,
      minerals: profile?.minerals ?? 0,
    });
  } catch (error) {
    console.error(
      "Attendance Status API Error:",
      error
    );

    return NextResponse.json(
      {
        checked: false,
        minerals: 0,
      },
      { status: 500 }
    );
  }
}