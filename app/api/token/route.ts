import { AccessToken } from "livekit-server-sdk"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const room = searchParams.get("room")
  const name = searchParams.get("name")
  const role = searchParams.get("role") || "student"

  if (!room) {
    return Response.json(
      { error: "room required" },
      { status: 400 }
    )
  }

  if (!name) {
    return Response.json(
      { error: "name required" },
      { status: 400 }
    )
  }

  const apiKey = process.env.LIVEKIT_API_KEY!
  const apiSecret = process.env.LIVEKIT_API_SECRET!

  /* =========================
     안정적인 identity 구조
  ========================= */
  const identity = JSON.stringify({
    name,
    role,
    room,
    id: Math.random().toString(36).slice(2, 8),
  })

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
  })

  /* =========================
     room 권한 설정
  ========================= */
  at.addGrant({
    roomJoin: true,
    room,
  })

  return Response.json({
    token: await at.toJwt(),
    identity,
  })
}