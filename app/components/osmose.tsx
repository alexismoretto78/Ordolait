"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import {
  setTargetValue,
} from "../lib/orderSlice"

export default function Osmose() {
  const dispatch = useDispatch()
  const {
    commands,
    activeCommandId
  } = useSelector((state: RootState) => state.order)

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  const [localTarget, setLocalTarget] = useState(activeCommand.targetValue.toString())

  // Sync inputs when switching commands
  useEffect(() => {
    if (activeCommand) {
      setLocalTarget(activeCommand.targetValue.toString())
    }
  }, [activeCommandId, activeCommand.targetValue])

  const parseNumber = (value: string) => Number(value.trim().replace(",", ".")) || 0
  
  const fcv = activeCommand.milkReceptionValue > 0 ? activeCommand.targetValue / activeCommand.milkReceptionValue : 0

  return (
    <div className="card">
      <h2>2. Osmose du lait — {activeCommand.name}</h2>
      <div className="form-grid">
        
        {/* Dynamic Read-only average protein from TLC */}
        <div className="form-group">
          <label className="form-label" style={{ color: "var(--text-muted)" }}>
            Matière protéique moyenne à réception (Ci)
            <div 
              style={{ 
                padding: "10px 14px", 
                backgroundColor: "var(--bg-app)", 
                border: "1px dashed var(--primary-border)", 
                borderRadius: "var(--radius-sm)", 
                fontSize: "1.05rem", 
                fontWeight: 700, 
                color: "var(--primary)",
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>🧪 {activeCommand.milkReceptionValue.toFixed(3)} g/L</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>CALCULÉ DPUIS TLC</span>
            </div>
          </label>
        </div>

        {/* Target protein Cf input */}
        <div className="form-group">
          <label className="form-label">
            Taux protéique cible après osmose (Cf)
            <input
              type="text"
              inputMode="decimal"
              value={localTarget}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => {
                const val = event.target.value
                setLocalTarget(val)
                dispatch(setTargetValue(parseNumber(val)))
              }}
              className="form-input"
              style={{ fontWeight: 700, fontSize: "1.05rem" }}
            />
          </label>
        </div>

        {/* FCV and volumes info */}
        <div className="info-section">
          <div className="info-item">
            <span className="info-label">FCV (Concentration)</span>
            <span className="info-value" style={{ color: "var(--primary)" }}>{fcv > 0 ? fcv.toFixed(3) : "-"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Volume concentré (osmosé)</span>
            <span className="info-value">{activeCommand.osmosedVolume.toFixed(1)} L</span>
          </div>

          <div className="info-item">
            <span className="info-label">Volume lait cru brut requis</span>
            <span className="info-value">{activeCommand.milkReceivedVolume.toFixed(1)} L</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <span className="status-text">
              Statut processus : {activeCommand.status.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", marginTop: 4 }}>
            * Durée de l&apos;osmose : 1h30 (90 min) pour 5 200 L de lait cru pour un FCV de 1,28 (s&apos;ajuste proportionnellement selon le volume et le FCV réel).
          </p>
        </div>
      </div>
    </div>
  )
}
