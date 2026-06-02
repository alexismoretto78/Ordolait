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
  setSkyrMilkType,
  setSkyrDirectPasto,
  MilkType,
  updateCommandName
} from "../lib/orderSlice"

const ALL_PRESETS = [
  { name: "Skyr", grams: 105 },
  { name: "Baiko", grams: 105 },
  { name: "Val de Praz", grams: 105 },
  { name: "Nature", grams: 105 },
  { name: "MDD", grams: 105 }
]

export default function Commande() {
  const dispatch = useDispatch()
  const { commands, activeCommandId, productionStartTime, isSimulating } = useSelector(
    (state: RootState) => state.order
  )

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  const hasSkyr = activeCommand ? activeCommand.references.some(r => r.name.toLowerCase().includes("skyr")) : false
  const hasClassic = activeCommand ? activeCommand.references.some(r => !r.name.toLowerCase().includes("skyr")) : false

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


  const [editingCommandId, setEditingCommandId] = useState<string | null>(null)
  const [editingCommandName, setEditingCommandName] = useState<string>("")

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

      // Check if manually typed name matches any preset to auto-set format (grams)
      const matched = ALL_PRESETS.find(p => p.name.toLowerCase() === valueStr.trim().toLowerCase())
      if (matched) {
        setLocalRefGrams(prev => ({ ...prev, [refId]: matched.grams.toString() }))
        dispatch(updateReference({
          cmdId: activeCommand.id,
          refId,
          fields: { name: valueStr, gramPerPot: matched.grams }
        }))
        return
      }
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

  const handleSelectPredefinedRef = (refId: string, name: string, grams: number) => {
    setLocalRefNames(prev => ({ ...prev, [refId]: name }))
    setLocalRefGrams(prev => ({ ...prev, [refId]: grams.toString() }))

    dispatch(updateReference({
      cmdId: activeCommand.id,
      refId,
      fields: { name, gramPerPot: grams }
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
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 12, marginBottom: 16, borderBottom: "1px solid var(--border-color)" }}>
        {commands.map((cmd) => {
          const isActive = cmd.id === activeCommandId
          const cmdPots = cmd.references.reduce((s, r) => s + r.potsQty, 0)
          return (
            <div
              key={cmd.id}
              onClick={() => {
                if (editingCommandId !== cmd.id) {
                  dispatch(setActiveCommand(cmd.id))
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                setEditingCommandId(cmd.id)
                setEditingCommandName(cmd.name)
              }}
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
              {editingCommandId === cmd.id ? (
                <input
                  type="text"
                  value={editingCommandName}
                  autoFocus
                  onChange={(e) => setEditingCommandName(e.target.value)}
                  onBlur={() => {
                    if (editingCommandName.trim()) {
                      dispatch(updateCommandName({ id: cmd.id, name: editingCommandName.trim() }))
                    }
                    setEditingCommandId(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (editingCommandName.trim()) {
                        dispatch(updateCommandName({ id: cmd.id, name: editingCommandName.trim() }))
                      }
                      setEditingCommandId(null)
                    } else if (e.key === 'Escape') {
                      setEditingCommandId(null)
                    }
                  }}
                  style={{
                    border: "1px solid var(--primary-border)",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "0.85rem",
                    outline: "none",
                    width: "120px",
                    background: "#fff",
                    color: "var(--text-main)",
                    fontWeight: "600"
                  }}
                />
              ) : (
                <span>{cmd.name}</span>
              )}
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

          <div className="table-container" style={{ borderRadius: "var(--radius-md)", overflowX: "auto" }}>
            <table className="mobile-responsive-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "10px 14px", color: "var(--text-muted)", minWidth: "260px" }}>Nom Réf</th>
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

                  // Predefined references lists check
                  const presets = ALL_PRESETS

                  return (
                    <tr key={ref.id} className="responsive-tr" style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "#ffffff" }}>
                      <td data-label="Nom Réf" className="responsive-td" style={{ padding: "8px 12px" }}>
                        <div style={{ position: "relative", width: "100%" }}>
                          <select
                            value={localRefNames[ref.id] || ""}
                            onChange={(e) => {
                              const selectedName = e.target.value
                              const preset = ALL_PRESETS.find(p => p.name === selectedName)
                              if (preset) {
                                handleSelectPredefinedRef(ref.id, preset.name, preset.grams)
                              } else {
                                handleUpdateRef(ref.id, "name", selectedName)
                              }
                            }}
                            style={{
                              width: "100%",
                              padding: "8px 32px 8px 12px",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              outline: "none",
                              backgroundColor: "#fff",
                              transition: "border-color 0.15s ease-in-out",
                              cursor: "pointer",
                              appearance: "none",
                            }}
                          >
                            {ALL_PRESETS.some(p => p.name === localRefNames[ref.id]) ? null : (
                              <option value={localRefNames[ref.id] || ""} disabled>
                                {localRefNames[ref.id] || "Choisir une référence"}
                              </option>
                            )}
                            {ALL_PRESETS.map(preset => (
                              <option key={preset.name} value={preset.name}>
                                {preset.name}
                              </option>
                            ))}
                          </select>

                          <div style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            color: "var(--text-muted)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>
                      </td>

                      <td data-label="Quantité (pots)" className="responsive-td" style={{ padding: "8px 12px", textAlign: "center" }}>
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

                      <td data-label="Format (g)" className="responsive-td" style={{ padding: "8px 12px", textAlign: "center" }}>
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

                      <td data-label="Masse Blanche" className="responsive-td" style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: "var(--primary)" }}>
                        {massKg.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} kg
                      </td>

                      <td className="responsive-td-action" style={{ padding: "8px 12px", textAlign: "center" }}>
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
