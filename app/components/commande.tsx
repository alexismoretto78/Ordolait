"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { 
  addCommand, 
  deleteCommand, 
  setActiveCommand, 
  setCommandMilkType,
  setProductionStartTime,
  addReference,
  updateReference,
  deleteReference,
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

  // Track local input values to avoid dispatch lag during fast typing
  const [localRefNames, setLocalRefNames] = useState<{ [refId: string]: string }>({})
  const [localRefPots, setLocalRefPots] = useState<{ [refId: string]: string }>({})
  const [localRefGrams, setLocalRefGrams] = useState<{ [refId: string]: string }>({})

  // Initialize and synchronize local values when command or references change
  useEffect(() => {
    if (activeCommand) {
      const names: typeof localRefNames = {}
      const pots: typeof localRefPots = {}
      const grams: typeof localRefGrams = {}

      activeCommand.references.forEach(ref => {
        names[ref.id] = ref.name
        pots[ref.id] = ref.potsQty.toString()
        grams[ref.id] = ref.gramPerPot.toString()
      })

      setLocalRefNames(names)
      setLocalRefPots(pots)
      setLocalRefGrams(grams)
    }
  }, [activeCommandId, activeCommand?.references])

  const handleUpdateRef = (refId: string, field: "name" | "potsQty" | "gramPerPot", valueStr: string) => {
    let parsedValue: any = valueStr

    if (field === "name") {
      setLocalRefNames(prev => ({ ...prev, [refId]: valueStr }))
    } else if (field === "potsQty") {
      const cleanVal = valueStr.replace(/[^0-9]/g, "")
      setLocalRefPots(prev => ({ ...prev, [refId]: cleanVal }))
      parsedValue = Number(cleanVal) || 0
    } else if (field === "gramPerPot") {
      const cleanVal = valueStr.replace(/[^0-9]/g, "")
      setLocalRefGrams(prev => ({ ...prev, [refId]: cleanVal }))
      parsedValue = Number(cleanVal) || 0
    }

    dispatch(updateReference({
      cmdId: activeCommand.id,
      refId,
      fields: { [field]: parsedValue }
    }))
  }

  // Calculate total pots quantity for active command
  const totalPots = activeCommand.references.reduce((sum, r) => sum + r.potsQty, 0)

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 12, marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>1. Commandes Clients</h2>
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
        {commands.map((cmd) => {
          const isActive = cmd.id === activeCommandId
          const cmdPots = cmd.references.reduce((s, r) => s + r.potsQty, 0)
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
                ({(cmdPots / 1000).toFixed(0)}k pots)
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
        
        {/* Product References List Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Références Produits de la Commande
            </span>
            
            <button
              type="button"
              onClick={() => dispatch(addReference({ cmdId: activeCommand.id }))}
              className="btn btn-secondary"
              style={{ padding: "4px 10px", fontSize: "0.75rem", color: "var(--primary)", borderColor: "var(--primary-border)" }}
            >
              ➕ Ajouter une référence
            </button>
          </div>

          <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "10px 14px", color: "var(--text-muted)" }}>Nom Réf</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-muted)", textAlign: "center", width: "140px" }}>Quantité (pots)</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-muted)", textAlign: "center", width: "120px" }}>Format (g)</th>
                  <th style={{ padding: "10px 14px", color: "var(--text-muted)", textAlign: "center", width: "130px" }}>Masse Blanche</th>
                  <th style={{ padding: "10px 14px", width: "50px" }}></th>
                </tr>
              </thead>
              <tbody>
                {activeCommand.references.map((ref) => {
                  const refPots = Number(localRefPots[ref.id]) || 0
                  const refGrams = Number(localRefGrams[ref.id]) || 0
                  const massKg = (refPots * refGrams) / 1000

                  return (
                    <tr key={ref.id} style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "#ffffff" }}>
                      <td style={{ padding: "8px 12px" }}>
                        <input
                          type="text"
                          value={localRefNames[ref.id] || ""}
                          onChange={(e) => handleUpdateRef(ref.id, "name", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        />
                      </td>
                      
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <input
                          type="text"
                          value={localRefPots[ref.id] || ""}
                          onChange={(e) => handleUpdateRef(ref.id, "potsQty", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            textAlign: "center"
                          }}
                        />
                      </td>
                      
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <input
                          type="text"
                          value={localRefGrams[ref.id] || ""}
                          onChange={(e) => handleUpdateRef(ref.id, "gramPerPot", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            textAlign: "center"
                          }}
                        />
                      </td>

                      <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: "var(--primary)" }}>
                        {massKg.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} kg
                      </td>

                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        {activeCommand.references.length > 1 && (
                          <button
                            type="button"
                            onClick={() => dispatch(deleteReference({ cmdId: activeCommand.id, refId: ref.id }))}
                            style={{
                              border: "none",
                              background: "none",
                              color: "var(--text-muted)",
                              cursor: "pointer",
                              fontSize: "1rem",
                              fontWeight: 700
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Production Date/Time start */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginTop: 8 }}>
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
        </div>

        {/* Command Milk Type Selector */}
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

        {/* Global Totals Summary */}
        <div className="info-section" style={{ marginTop: 12 }}>
          <div className="info-item">
            <span className="info-label">Pots totaux commandés</span>
            <span className="info-value">{totalPots.toLocaleString()} pots</span>
          </div>
          <div className="info-item">
            <span className="info-label">Masse blanche totale calculée</span>
            <span className="info-value">{activeCommand?.whiteMassKg?.toFixed(1) || "0.0"} kg</span>
          </div>
          <div className="info-item">
            <span className="info-label">Lait cru active requis (estimé)</span>
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
