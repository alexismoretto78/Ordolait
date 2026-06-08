"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import {
  CF_TANKS,
  setRefDestination,
  setRefPotsLaunched,
  launchRefToMachine,
  setActiveCommand,
} from "../lib/orderSlice"
import { useState, useEffect } from "react"

export default function Lancement() {
  const dispatch = useDispatch()
  const { commands, activeCommandId } = useSelector((state: RootState) => state.order)

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  // Local state to manage custom pots inputs to avoid rapid dispatch lag
  const [localPots, setLocalPots] = useState<{ [refId: string]: { atia: string; grunwald: string } }>({})

  // Initialize and synchronize local inputs when active command or references change
  useEffect(() => {
    if (activeCommand) {
      const inputs: typeof localPots = {}
      activeCommand.references.forEach(ref => {
        const custom = activeCommand.refPotsLaunched?.[ref.id]
        const dest = activeCommand.refDestinations?.[ref.id] || "both"
        const defaultTotal = ref.potsQty

        let defaultAtia = ""
        let defaultGrun = ""

        if (dest === "atia") {
          defaultAtia = custom?.atia !== undefined ? custom.atia.toString() : defaultTotal.toString()
          defaultGrun = "0"
        } else if (dest === "grunwald") {
          defaultAtia = "0"
          defaultGrun = custom?.grunwald !== undefined ? custom.grunwald.toString() : defaultTotal.toString()
        } else {
          defaultAtia = custom?.atia !== undefined ? custom.atia.toString() : Math.round(defaultTotal * 3500 / 13500).toString()
          defaultGrun = custom?.grunwald !== undefined ? custom.grunwald.toString() : Math.round(defaultTotal * 10000 / 13500).toString()
        }

        inputs[ref.id] = { atia: defaultAtia, grunwald: defaultGrun }
      })
      setLocalPots(inputs)
    }
  }, [activeCommand])

  if (!activeCommand || activeCommand.references.length === 0) {
    return (
      <div className="card" style={{ backgroundColor: "var(--bg-app)" }}>
        <h2>🚀 Cockpit de Lancement sur Machines</h2>
        <p style={{ color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
          Veuillez d&apos;abord créer une commande et configurer des références produits dans l&apos;onglet Commandes.
        </p>
      </div>
    )
  }

  // Calculate allocated volumes of CF tanks for this active command
  const allocatedVolumes: { [key: string]: number } = {}
  let remainingVolumeToDistribute = activeCommand.whiteMassKg

  CF_TANKS.forEach((tank) => {
    if (activeCommand.selectedCFs.includes(tank.name)) {
      const allocated = Math.min(remainingVolumeToDistribute, tank.capacity)
      allocatedVolumes[tank.name] = allocated
      remainingVolumeToDistribute = Math.max(0, remainingVolumeToDistribute - allocated)
    } else {
      allocatedVolumes[tank.name] = 0
    }
  })

  const handlePotsChange = (refId: string, machine: "atia" | "grunwald", valueStr: string) => {
    // Only allow numbers
    const cleanStr = valueStr.replace(/[^0-9]/g, "")
    
    setLocalPots(prev => ({
      ...prev,
      [refId]: {
        ...prev[refId],
        [machine]: cleanStr
      }
    }))

    const valNum = Number(cleanStr) || 0
    dispatch(setRefPotsLaunched({
      cmdId: activeCommand.id,
      refId,
      [machine]: valNum
    }))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* active command header */}
      <div className="card" style={{ borderLeft: "4px solid var(--primary)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>PILOTAGE MACHINE</span>
            <h2 style={{ margin: 0, paddingBottom: 0, borderBottom: "none", marginTop: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              🚀 Lancement sur Machines
            </h2>
          </div>
          
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: "8px" }}>
            {commands.map((cmd) => {
              const isActive = cmd.id === activeCommandId
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => dispatch(setActiveCommand(cmd.id))}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 6,
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: isActive ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                    backgroundColor: isActive ? "var(--primary-light)" : "white",
                    cursor: "pointer",
                    minWidth: "220px",
                    transition: "all 0.2s ease-in-out",
                    boxShadow: isActive ? "0 4px 12px rgba(59, 130, 246, 0.15)" : "none"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.95rem", color: isActive ? "var(--primary)" : "var(--text-color)" }}>{cmd.name}</span>
                    {cmd.isSkyr && (
                      <span style={{ fontSize: "0.65rem", padding: "2px 6px", borderRadius: "8px", backgroundColor: "var(--violet)", color: "#ffffff", fontWeight: 800 }}>
                        SKYR
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, marginTop: 4 }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <span>🥛</span> {cmd.whiteMassKg.toFixed(0)} kg (Maturation)
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <span>🏭</span> CF: {cmd.selectedCFs.length > 0 ? cmd.selectedCFs.join(", ") : "Aucune"}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Left Side: references list to launch */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {activeCommand.references.map((ref) => {
            const dest = activeCommand.refDestinations?.[ref.id] || "both"
            const sent = activeCommand.refSentStatus?.[ref.id] || { atia: false, grunwald: false }
            
            const needsAtia = dest === "atia" || dest === "both"
            const needsGrunwald = dest === "grunwald" || dest === "both"

            const atiaDone = !needsAtia || sent.atia
            const grunwaldDone = !needsGrunwald || sent.grunwald
            const isCompleted = atiaDone && grunwaldDone

            const currentLocal = localPots[ref.id] || { atia: "0", grunwald: "0" }

            return (
              <div 
                key={ref.id} 
                className={`launch-card ${isCompleted ? "completed" : ""}`}
                style={{
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px",
                  background: "#ffffff",
                  position: "relative",
                  transition: "var(--transition)",
                  borderLeft: isCompleted ? "4px solid var(--success)" : "4px solid var(--warning)"
                }}
              >
                
                {/* Reference Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>📦 {ref.name}</h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                      Volume de référence : <strong>{((ref.potsQty * ref.gramPerPot) / 1000).toFixed(0)} kg</strong> ({ref.potsQty.toLocaleString()} pots de {ref.gramPerPot}g)
                    </div>
                  </div>
                  {isCompleted && (
                    <span className="badge-completed" style={{ backgroundColor: "var(--success)" }}>COMPLÉTÉ</span>
                  )}
                </div>

                {/* Machine Destination Selection */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, backgroundColor: "var(--bg-app)", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginBottom: 16 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                    1. Sélectionner les lignes de conditionnement
                  </span>
                  
                  <div className="ref-dest-group" style={{ display: "flex", gap: 8 }}>
                    {(["atia", "grunwald", "both"] as const).map((d) => {
                      const isSelected = dest === d
                      const label = d === "atia" ? "ATIA uniquement (3 500 pots/h)" : d === "grunwald" ? "GRUNWALD uniquement (10 000 pots/h)" : "LES DEUX (Parallélisation)"
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => dispatch(setRefDestination({ cmdId: activeCommand.id, refId: ref.id, destination: d }))}
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.75rem",
                            fontWeight: isSelected ? "800" : "600",
                            border: `1px solid ${isSelected ? "var(--primary)" : "var(--border-color)"}`,
                            background: isSelected ? "var(--primary-light)" : "white",
                            color: isSelected ? "var(--primary)" : "var(--text-muted)",
                            cursor: "pointer",
                            transition: "var(--transition)",
                          }}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Saisie Nombre de Pots à Lancer & Pilotage */}
                <div className="launch-actions" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <span className="launch-actions-title">2. Pilotage & Quantité à Lancer</span>

                  {/* ATIA PILOT */}
                  {needsAtia && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: needsGrunwald ? "1px dashed var(--border-color)" : "none" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--primary)" }}>Ligne ATIA</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pots :</span>
                          <input
                            type="text"
                            value={currentLocal.atia}
                            disabled={sent.atia}
                            onChange={(e) => handlePotsChange(ref.id, "atia", e.target.value)}
                            style={{
                              width: "110px",
                              padding: "4px 8px",
                              fontSize: "0.85rem",
                              borderRadius: "4px",
                              border: "1px solid var(--border-color)",
                              fontWeight: 700,
                              textAlign: "center"
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        {sent.atia ? (
                          <span className="launch-sent-ok">✓ Envoyé sur ATIA</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => dispatch(launchRefToMachine({ cmdId: activeCommand.id, refId: ref.id, machine: "atia" }))}
                            className="btn-launch-machine btn-atia"
                            style={{ padding: "8px 16px", borderRadius: "6px", fontSize: "0.8rem" }}
                          >
                            🚀 Lancer ATIA
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* GRUNWALD PILOT */}
                  {needsGrunwald && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--success)" }}>Ligne GRUNWALD</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pots :</span>
                          <input
                            type="text"
                            value={currentLocal.grunwald}
                            disabled={sent.grunwald}
                            onChange={(e) => handlePotsChange(ref.id, "grunwald", e.target.value)}
                            style={{
                              width: "110px",
                              padding: "4px 8px",
                              fontSize: "0.85rem",
                              borderRadius: "4px",
                              border: "1px solid var(--border-color)",
                              fontWeight: 700,
                              textAlign: "center"
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        {sent.grunwald ? (
                          <span className="launch-sent-ok">✓ Envoyé sur GRUNWALD</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => dispatch(launchRefToMachine({ cmdId: activeCommand.id, refId: ref.id, machine: "grunwald" }))}
                            className="btn-launch-machine btn-grunwald"
                            style={{ padding: "8px 16px", borderRadius: "6px", fontSize: "0.8rem" }}
                          >
                            🚀 Lancer GRUNWALD
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )
          })}
        </div>

        {/* Right Side: CF tanks storage monitoring for the active command */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div className="card">
            <h2>🥛 État de la Masse Blanche (Maturation CF)</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16 }}>
              Les cuves suivantes stockent la masse blanche concentrée par osmose et poudrée pour la maturation (360 min) de la commande active.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activeCommand.selectedCFs.map((name) => {
                const vol = allocatedVolumes[name] || 0
                const tank = CF_TANKS.find(t => t.name === name)
                const capacity = tank?.capacity || 2200
                const pct = (vol / capacity) * 100

                return (
                  <div 
                    key={name}
                    style={{
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      padding: "12px 16px",
                      background: "var(--bg-app)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{name}</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
                        {vol.toFixed(0)} / {capacity} L ({pct.toFixed(0)}%)
                      </span>
                    </div>

                    {/* progress bar */}
                    <div style={{ background: "#e2e8f0", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                      <div 
                        style={{ 
                          background: "linear-gradient(90deg, var(--primary) 0%, var(--success) 100%)", 
                          height: "100%", 
                          width: `${pct}%` 
                        }} 
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="info-section" style={{ marginTop: 16 }}>
              <div className="info-item">
                <span className="info-label">Masse blanche totale</span>
                <span className="info-value">{activeCommand.whiteMassKg.toFixed(0)} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Volume concentré CF</span>
                <span className="info-value">{activeCommand.whiteMassKg.toFixed(0)} L</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
