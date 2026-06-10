"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 8)
    router.push(`/room/${roomId}`)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>1:1 과외 플랫폼 MVP</h1>

      <p>지인 테스트용 간단 버전</p>

      <button
        onClick={createRoom}
        style={{
          marginTop: 20,
          padding: 10,
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        과외방 만들기
      </button>
    </div>
  )
}