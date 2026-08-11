import { postLogin } from "@/api/data";
import { cookies } from "next/headers";

//로그인을 하기 위해서는 id,pw을 주고 토큰을 받으면 된다. -post
export async function POST(request: Request) {
  //요청에서 입력한 id,pw를 꺼낸다.
  const { email, password } = await request.json();

  //실제로 맞는지 검증 - 백엔드 호출

  try {
    const data = await postLogin({ email, password });

    //쿠키에 세팅
    (await cookies()).set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
    });

    return Response.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "로그인에 실패했습니다.";
    return Response.json({ success: false, message }, { status: 401 });
  }
}

