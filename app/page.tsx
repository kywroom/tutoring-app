"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState("")

  const createRoom = () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.")
      return
    }

    const roomId = Math.random().toString(36).substring(2, 8)

    // 👉 선생님은 바로 입장 (name + role 전달)
    router.push(
      `/room/${roomId}?name=${encodeURIComponent(name)}&role=teacher`
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>🎓 과외 플랫폼</h1>

      <p>선생님 방 생성</p>

      <input
        placeholder="선생님 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: 10, width: 250 }}
      />

      <button
        onClick={createRoom}
        style={{ marginLeft: 10, padding: 10 }}
      >
        과외방 만들기
      </button>
    </div>
  )
}