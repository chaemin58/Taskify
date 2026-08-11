import { cookies } from "next/headers";

export async function POST() {
  //at 삭제
  (await cookies()).delete("accessToken");
  return Response.json({ success: true });
}

