import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";

  // 외부 주소로 강제 이동되는 것을 방지
  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost =
        request.headers.get("x-forwarded-host");

      // 로컬 개발환경
      if (process.env.NODE_ENV === "development") {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Vercel 환경
      if (forwardedHost) {
        return NextResponse.redirect(
          `https://${forwardedHost}${next}`
        );
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error(
      "Supabase auth code exchange error:",
      error.message
    );
  }

  return NextResponse.redirect(
    `${origin}/auth?error=auth_callback_failed`
  );
}