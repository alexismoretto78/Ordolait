"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { 
  addCommand, 
  deleteCommand, 
  setActiveCommand, 
  setCommandMilkType,
  setOrderQty, 
  setGramPerPot, 
  setProductionStartTime,
  MilkType
} from "../lib/orderSlice"

export default function Commande() {
  const dispatch = useDispatch()
  const { commands, activeCommandId, productionStartTime, isSimulating } = useSelector(
    (state: RootState) => state.order
  )

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  useEffect(() => {
    if (!productionStartTime) {
      const now = new Date()
      const offset = now.getTimezoneOffset()
      const localNow = new Date(now.getTime() - offset * 60 * 1000)
      dispatch(setProductionStartTime(localNow.toISOString().slice(0, 16)))
    }
  }, [productionStartTime, dispatch])

  const [localOrderQty, setLocalOrderQty] = useState(activeCommand?.orderQty?.toString() || "0")
  const [localGramPerPot, setLocalGramPerPot] = useState(activeCommand?.gramPerPot?.toString() || "0")

  // Synchronize input fields when the active command changes
  useEffect(() => {
    if (activeCommand) {
      setLocalOrderQty(activeCommand.orderQty.toString())
      setLocalGramPerPot(activeCommand.gramPerPot.toString())
    }
  }, [activeCommandId, activeCommand?.orderQty, activeCommand?.gramPerPot])

  const parseNumber = (value: string) => Number(value.trim().replace(",", ".") || "0")

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 12, marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>1. Commandes clients</h2>
        <button
          type="button"
          onClick={() => dispatch(addCommand())}
          className="btn btn-success"
          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
        >
          ➕ Ajouter une commande
        </button>
      </div>

      {/* Command Tabs Selection */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 16, borderBottom: "1px solid var(--border-color)" }}>
        {commands.map((cmd, idx) => {
          const isActive = cmd.id === activeCommandId
          return (
            <div
              key={cmd.id}
              onClick={() => dispatch(setActiveCommand(cmd.id))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${isActive ? "var(--primary)" : "var(--border-color)"}`,
                backgroundColor: isActive ? "var(--primary-light)" : "white",
                color: isActive ? "var(--primary)" : "var(--text-main)",
                fontWeight: isActive ? "700" : "500",
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "var(--transition)",
                whiteSpace: "nowrap",
                boxShadow: isActive ? "var(--shadow-sm)" : "none",
              }}
            >
              <span>{cmd.name}</span>
              <span style={{ fontSize: "0.75rem", opacity: 0.75, fontWeight: "normal" }}>
                ({(cmd.orderQty / 1000).toFixed(0)}k pots)
              </span>
              
              {commands.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch(deleteCommand(cmd.id))
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    color: isActive ? "var(--primary)" : "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    padding: "0 2px",
                    display: "flex",
                    alignItems: "center",
                    transition: "var(--transition)",
                  }}
                  title="Supprimer la commande"
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = isActive ? "var(--primary)" : "var(--text-muted)"}
                >
                  ✕
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="form-grid">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          <div className="form-group">
            <label className="form-label">
              Nombre de pots
              <input
                type="text"
                inputMode="decimal"
                step="any"
                value={localOrderQty}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => {
                  const val = event.target.value
                  setLocalOrderQty(val)
                  dispatch(setOrderQty(parseNumber(val)))
                }}
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">
              Grammage par pot (g)
              <input
                type="text"
                inputMode="decimal"
                step="any"
                value={localGramPerPot}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => {
                  const val = event.target.value
                  setLocalGramPerPot(val)
                  dispatch(setGramPerPot(parseNumber(val)))
                }}
                className="form-input"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Date & Heure globale de début de production
            <input
              type="datetime-local"
              value={productionStartTime}
              disabled={isSimulating}
              onChange={(event) => {
                dispatch(setProductionStartTime(event.target.value))
              }}
              className="form-input"
            />
          </label>
        </div>

        {/* Premium Command Milk Type Selector */}
        <div className="form-group" style={{ marginTop: 4 }}>
          <span className="form-label" style={{ marginBottom: 6 }}>Type de lait requis pour cette commande</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {(["bio", "fcv3", "savoie", "montagne"] as MilkType[]).map((type) => {
              const isSelected = (activeCommand.milkType || "bio") === type
              const colors = {
                bio: { color: "var(--success)", bg: "rgba(16, 185, 129, 0.1)", label: "🌱 Bio" },
                fcv3: { color: "var(--primary)", bg: "rgba(37, 99, 235, 0.1)", label: "🧪 FCV3" },
                savoie: { color: "var(--warning)", bg: "rgba(245, 158, 11, 0.1)", label: "🏔️ Savoie" },
                montagne: { color: "var(--violet)", bg: "rgba(139, 92, 246, 0.1)", label: "⛰️ Montagne" }
              }[type]

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => dispatch(setCommandMilkType({ id: activeCommand.id, milkType: type }))}
                  style={{
                    padding: "10px 4px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8rem",
                    fontWeight: isSelected ? "800" : "600",
                    border: `1px solid ${isSelected ? colors.color : "var(--border-color)"}`,
                    background: isSelected ? colors.bg : "#ffffff",
                    color: isSelected ? colors.color : "var(--text-muted)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    textAlign: "center",
                    boxShadow: isSelected ? "inset 0 1px 2px rgba(0,0,0,0.02)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = colors.color
                      e.currentTarget.style.color = colors.color
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "var(--border-color)"
                      e.currentTarget.style.color = "var(--text-muted)"
                    }
                  }}
                >
                  {colors.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="info-section" style={{ marginTop: 8 }}>
          <div className="info-item">
            <span className="info-label">Masse blanche active</span>
            <span className="info-value">{activeCommand?.whiteMassKg?.toFixed(1) || "0.0"} kg</span>
          </div>
          <div className="info-item">
            <span className="info-label">Lait cru active</span>
            <span className="info-value">{activeCommand?.milkReceivedVolume?.toFixed(1) || "0.0"} L</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="status-text" style={{ margin: 0 }}>
            Statut commande active : <strong style={{ color: "var(--primary)" }}>{activeCommand?.status?.toUpperCase() || "IDLE"}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
