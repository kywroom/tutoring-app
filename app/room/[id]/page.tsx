"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import {
  LiveKitRoom,
  AudioConference,
  useParticipants,
  useRoomContext,
} from "@livekit/components-react"

import "@livekit/components-styles"

/* =========================
   identity 안전 파서
========================= */
function parseIdentity(identity: string) {
  try {
    // JSON 형태면 파싱
    if (identity.startsWith("{")) {
      return JSON.parse(identity)
    }
  } catch (e) {}

  // fallback (기존 문자열 방식)
  const parts = identity.split("-")
  return {
    name: parts[0] || "unknown",
    role: parts[1] || "student",
  }
}

/* =========================
   참가자 목록
========================= */
function ParticipantList() {
  const room = useRoomContext()
  const participants = useParticipants()

  const [logs, setLogs] = useState<string[]>([])

  const joinTimeMap = useRef<Map<string, number>>(new Map())
  const prevSet = useRef<Set<string>>(new Set())

  /* =========================
     LiveKit 이벤트 기반 (정석)
  ========================= */
  useEffect(() => {
    const handleJoin = (p: any) => {
      if (!joinTimeMap.current.has(p.identity)) {
        joinTimeMap.current.set(p.identity, Date.now())

        const info = parseIdentity(p.identity)

        setLogs((prev) => [
          ...prev,
          `🟢 ${info.name} 입장`,
        ])
      }
    }

    const handleLeave = (p: any) => {
      const info = parseIdentity(p.identity)

      setLogs((prev) => [
        ...prev,
        `🔴 ${info.name} 퇴장`,
      ])
    }

    room.on("participantConnected", handleJoin)
    room.on("participantDisconnected", handleLeave)

    return () => {
      room.off("participantConnected", handleJoin)
      room.off("participantDisconnected", handleLeave)
    }
  }, [room])

  /* =========================
     입장 순 정렬
  ========================= */
  const sorted = [...participants].sort((a, b) => {
    const tA = joinTimeMap.current.get(a.identity) || 0
    const tB = joinTimeMap.current.get(b.identity) || 0
    return tA - tB
  })

  return (
    <div style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
      <h3>👥 참가자 목록</h3>

      <ul>
        {sorted.map((p) => {
          const info = parseIdentity(p.identity)

          return (
            <li key={p.identity}>
              {info.name} ({info.role})
            </li>
          )
        })}
      </ul>

      <div style={{ marginTop: 10 }}>
        <h4>📢 알림</h4>

        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  )
}

/* =========================
   Room Page
========================= */
export default function RoomPage() {
  
  const params = useParams<{ id: string }>()
  
  const roomId = params.id

  const [token, setToken] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [inputName, setInputName] = useState("")

  const isTeacher = role === "teacher"

  /* =========================
     입장
  ========================= */
  const enterRoom = async (userName: string, userRole: string) => {
    setName(userName)
    setRole(userRole)

    const res = await fetch(
      `/api/token?room=${roomId}&name=${encodeURIComponent(
        userName
      )}&role=${userRole}`
    )

    const data = await res.json()
    setToken(data.token)
  }

  /* =========================
     선생 자동 입장
  ========================= */
  useEffect(() => {
    const paramsUrl = new URLSearchParams(window.location.search)

    const urlName = paramsUrl.get("name")
    const urlRole = paramsUrl.get("role")

    if (urlName && urlRole === "teacher") {
      enterRoom(urlName, urlRole)
    }
  }, [])

  /* =========================
     학생 입장 UI
  ========================= */
  if (!name) {
    return (
      <div style={{ padding: 40 }}>
        <h2>🎓 학생 입장</h2>

        <input
          placeholder="이름 입력"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          style={{ padding: 10, width: 250 }}
        />

        <button
          onClick={() => enterRoom(inputName, "student")}
          style={{ marginLeft: 10, padding: 10 }}
        >
          입장
        </button>
      </div>
    )
  }

  /* =========================
     로딩
========================= */
  if (!token) {
    return <div style={{ padding: 40 }}>🎤 연결 중...</div>
  }

  /* =========================
     메인 UI
========================= */
  return (
    <div style={{ height: "100vh", padding: 20 }}>
      <h2>🎤 과외방: {roomId}</h2>

      <p>
        👤 내 이름: {name} ({role})
      </p>

      <div
        style={{
          padding: 10,
          marginBottom: 10,
          background: isTeacher ? "#e6f0ff" : "#fff7e6",
        }}
      >
        {isTeacher ? "👨‍🏫 선생님 모드" : "👨‍🎓 학생 모드"}
      </div>

      <LiveKitRoom
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        audio={true}
        video={false}
      >
        <ParticipantList />
        <AudioConference />
      </LiveKitRoom>
    </div>
  )
}