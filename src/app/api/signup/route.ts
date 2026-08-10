import { postLogin, postSignup } from "@/api/data";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  //파라미터로 넘긴 리퀘스트에서 사용자가 지정한 id, pw, nickname을 꺼내서 넘겨야 한다.
  const { email, password, nickname } = await request.json();
  //백엔드 호출
  try {
    await postSignup({ email, password, nickname });
    const data = await postLogin({ email, password });

    (await cookies()).set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
    });

    return Response.json({ success: true });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "회원가입에 실패했습니다. ";
    return Response.json({ success: false, message }, { status: 400 });
  }
}

