"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import {
  setMilkReceptionValue,
  setTargetValue,
} from "../lib/orderSlice"

export default function Osmose() {
  const dispatch = useDispatch()
  const {
    commands,
    activeCommandId
  } = useSelector((state: RootState) => state.order)

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  const [localMilkReception, setLocalMilkReception] = useState(activeCommand.milkReceptionValue.toString())
  const [localTarget, setLocalTarget] = useState(activeCommand.targetValue.toString())

  // Sync inputs when switching commands or when redux values change externally
  useEffect(() => {
    if (activeCommand) {
      setLocalMilkReception(activeCommand.milkReceptionValue.toString())
      setLocalTarget(activeCommand.targetValue.toString())
    }
  }, [activeCommandId, activeCommand.milkReceptionValue, activeCommand.targetValue])

  const parseNumber = (value: string) => Number(value.trim().replace(",", ".") || "0")
  const fcv = activeCommand.milkReceptionValue > 0 ? activeCommand.targetValue / activeCommand.milkReceptionValue : 0

  return (
    <div className="card">
      <h2>2. Osmose du lait — {activeCommand.name}</h2>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Valeur à réception
            <input
              type="text"
              inputMode="decimal"
              value={localMilkReception}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => {
                const val = event.target.value
                setLocalMilkReception(val)
                dispatch(setMilkReceptionValue(parseNumber(val)))
              }}
              className="form-input"
            />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Valeur cible après osmose
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
            />
          </label>
        </div>

        <div className="info-section">
          <div className="info-item">
            <span className="info-label">FCV</span>
            <span className="info-value">{fcv > 0 ? fcv.toFixed(3) : "-"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Volume osmosé</span>
            <span className="info-value">{activeCommand.osmosedVolume.toFixed(1)} L</span>
          </div>

          <div className="info-item">
            <span className="info-label">Volume lait cru</span>
            <span className="info-value">{activeCommand.milkReceivedVolume.toFixed(1)} L</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <span className="status-text">
              Statut processus : {activeCommand.status}
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
