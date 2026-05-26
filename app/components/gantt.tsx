"use client"

import { useSelector } from "react-redux"
import { RootState } from "../lib/store"

const steps = [
  { key: "order", label: "Commande" },
  { key: "osmosis", label: "Osmose" },
  { key: "pasto", label: "Pasteurisation" },
  { key: "cuve", label: "Cuve" },
  { key: "dispatched", label: "Machines" },
]

export default function Gantt() {
  const { status } = useSelector((state: RootState) => state.order)

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>5. Suivi de l’état</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {steps.map((step) => {
          const active =
            step.key === status ||
            (status === "dispatched" && step.key === "dispatched")
          return (
            <span
              key={step.key}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: active ? "#1d4ed8" : "#e5e7eb",
                color: active ? "white" : "#374151",
                fontWeight: active ? 700 : 500,
              }}
            >
              {step.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
