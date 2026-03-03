import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "유효하지 않은 이메일 주소입니다." }, { status: 400 });
        }

        const supabase = await createClient();

        const { error } = await supabase
            .from("subscribers")
            .insert([{ email: email.toLowerCase() }]);

        if (error) {
            // Check for unique violation error code (23505 in Postgres)
            if (error.code === "23505") {
                return NextResponse.json({ error: "이미 구독 중입니다!" }, { status: 400 });
            }
            console.error("Subscription error:", error);
            return NextResponse.json({ error: "구독에 실패했습니다. 다시 시도해 주세요." }, { status: 500 });
        }

        return NextResponse.json({ message: "성공적으로 구독되었습니다! 곧 메일함을 확인해 주세요." }, { status: 200 });
    } catch (err) {
        console.error("Server error during subscription:", err);
        return NextResponse.json({ error: "내부 서버 오류" }, { status: 500 });
    }
}
