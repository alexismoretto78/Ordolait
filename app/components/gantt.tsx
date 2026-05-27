"use client"

import { useSelector } from "react-redux"
import { RootState } from "../lib/store"

interface GanttTask {
  key: string
  label: string
  startMinute: number
  durationMinutes: number
  color: string
}

export default function Gantt() {
  const { status, timing } = useSelector((state: RootState) => state.order)

  // Construire le timeline
  let currentMinute = 0
  const tasks: GanttTask[] = []

  if (timing.transferTime > 0) {
    tasks.push({
      key: "transfer",
      label: "Transfert TLC→TLS",
      startMinute: currentMinute,
      durationMinutes: timing.transferTime,
      color: "#3b82f6",
    })
    currentMinute += timing.transferTime
  }

  if (timing.osmoseTime > 0) {
    tasks.push({
      key: "osmose",
      label: "Osmose",
      startMinute: currentMinute,
      durationMinutes: timing.osmoseTime,
      color: "#10b981",
    })
    currentMinute += timing.osmoseTime
  }

  if (timing.powderTime > 0) {
    tasks.push({
      key: "powder",
      label: "Poudrage",
      startMinute: currentMinute,
      durationMinutes: timing.powderTime,
      color: "#f59e0b",
    })
    currentMinute += timing.powderTime
  }

  if (timing.pastoTime > 0) {
    tasks.push({
      key: "pasto",
      label: "Pasteurisation",
      startMinute: currentMinute,
      durationMinutes: timing.pastoTime,
      color: "#ef4444",
    })
    currentMinute += timing.pastoTime
  }

  const totalDuration = currentMinute
  const scale = totalDuration > 0 ? 500 / totalDuration : 0

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return hours > 0 ? `${hours}h${mins}m` : `${mins}m`
  }

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>6. Planning Gantt</h2>

      {tasks.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic" }}>
          Complétez le formulaire pour voir le planning
        </p>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <div style={{ flex: 1, minWidth: 150 }}>
                <strong>Étape</strong>
              </div>
              <div style={{ flex: 1.5 }}>
                <strong>Durée</strong>
              </div>
              <div style={{ flex: 3 }}>
                <strong>Timeline</strong>
              </div>
            </div>

            {tasks.map((task) => (
              <div
                key={task.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 12,
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 150 }}>{task.label}</div>
                <div style={{ flex: 1.5 }}>
                  <span style={{ fontSize: 14 }}>
                    {formatTime(task.durationMinutes)}
                  </span>
                </div>
                <div style={{ flex: 3 }}>
                  <div
                    style={{
                      position: "relative",
                      height: 30,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: `${(task.startMinute * scale) / 500 * 100}%`,
                        width: `${(task.durationMinutes * scale) / 500 * 100}%`,
                        height: "100%",
                        backgroundColor: task.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 500,
                        borderRadius: 4,
                      }}
                    >
                      +{task.startMinute.toFixed(0)}m
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 20,
                padding: 12,
                backgroundColor: "#f9fafb",
                borderRadius: 4,
              }}
            >
              <strong>Durée totale : {formatTime(totalDuration)}</strong>
            </div>
          </div>

          <div style={{ marginTop: 20, fontSize: 12, color: "#666" }}>
            <p>
              <strong>Notes :</strong>
            </p>
            <ul>
              <li>Transfert TLC→TLS : {timing.transferTime.toFixed(1)} min</li>
              <li>Osmose : {timing.osmoseTime.toFixed(1)} min</li>
              <li>Poudrage : {timing.powderTime.toFixed(1)} min</li>
              <li>Pasteurisation : {timing.pastoTime.toFixed(1)} min</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
