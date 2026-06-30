"use client"

import { Excalidraw } from "@excalidraw/excalidraw"
import "@excalidraw/excalidraw/index.css"

export default function Whiteboard() {

  return (
    <div
      style={{
        height: "500px",
        border: "1px solid #ddd",
        marginTop: "20px"
      }}
    >
      <Excalidraw />
    </div>
  )
}