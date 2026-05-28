"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import {
  CF_TANKS,
  launchCFToMachine,
  setCFDestination,
  setAllCFDestinations,
} from "../lib/orderSlice"

export default function Lancement() {
  const dispatch = useDispatch()
  const { commands, activeCommandId } = useSelector((state: RootState) => state.order)

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  if (activeCommand.selectedCFs.length === 0) {
    return (
      <div className="card" style={{ backgroundColor: "var(--bg-app)" }}>
        <h2>5. Lancement des cuves sur machines — {activeCommand.name}</h2>
        <p style={{ color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
          Aucune cuve sélectionnée pour le moment. Veuillez configurer et sélectionner vos cuves à l&apos;étape précédente.
        </p>
      </div>
    )
  }

  // Calculate allocated volumes per selected CF
  const allocatedVolumes: { [key: string]: number } = {}
  let remainingVolumeToDistribute = activeCommand.osmosedVolume

  CF_TANKS.forEach((tank) => {
    if (activeCommand.selectedCFs.includes(tank.name)) {
      const allocated = Math.min(remainingVolumeToDistribute, tank.capacity)
      allocatedVolumes[tank.name] = allocated
      remainingVolumeToDistribute = Math.max(0, remainingVolumeToDistribute - allocated)
    } else {
      allocatedVolumes[tank.name] = 0
    }
  })

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>5. Lancement des cuves sur machines — {activeCommand.name}</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => dispatch(setAllCFDestinations("atia"))}
            className="btn btn-secondary"
            style={{ color: "var(--primary)", borderColor: "var(--primary-border)" }}
          >
            Tout sur ATIA
          </button>
          <button
            type="button"
            onClick={() => dispatch(setAllCFDestinations("grunwald"))}
            className="btn btn-secondary"
            style={{ color: "var(--success)", borderColor: "var(--success-border)" }}
          >
            Tout sur GRUNWALD
          </button>
          <button
            type="button"
            onClick={() => dispatch(setAllCFDestinations("both"))}
            className="btn btn-secondary"
            style={{ color: "var(--text-muted)" }}
          >
            Tout sur LES DEUX
          </button>
        </div>
      </div>

      {/* Selected Tanks Grid */}
      <div className="launch-grid">
        {activeCommand.selectedCFs.map((name) => {
          const destination = activeCommand.cfDestinations?.[name] || "both"
          const sent = activeCommand.cfSentStatus?.[name] || { atia: false, grunwald: false }
          const volume = allocatedVolumes[name] || 0

          const needsAtia = destination === "atia" || destination === "both"
          const needsGrunwald = destination === "grunwald" || destination === "both"

          const atiaDone = !needsAtia || sent.atia
          const grunwaldDone = !needsGrunwald || sent.grunwald
          const isFullyDispatched = atiaDone && grunwaldDone

          return (
            <div
              key={name}
              className={`launch-card ${isFullyDispatched ? "completed" : ""}`}
            >
              {/* Header Info */}
              <div className="launch-header">
                <div>
                  <span className="launch-title">{name}</span>
                  <div className="launch-volume">
                    Volume alloué : <strong>{volume.toFixed(1)} L</strong>
                  </div>
                </div>
                
                {/* Completed Badge */}
                {isFullyDispatched && (
                  <span className="badge-completed">
                    COMPLÉTÉ
                  </span>
                )}
              </div>

              {/* Destination Selector Configuration */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, backgroundColor: "var(--bg-app)", padding: 10, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  1. Machine de destination
                </span>
                <div className="cuve-dest-btn-group" style={{ justifyContent: "flex-start", gap: 6 }}>
                  {(["atia", "grunwald", "both"] as const).map((dest) => {
                    const isDestSelected = destination === dest
                    const label = dest === "atia" ? "ATIA" : dest === "grunwald" ? "GRUNWALD" : "LES DEUX"
                    
                    return (
                      <button
                        key={dest}
                        type="button"
                        onClick={() => {
                          dispatch(setCFDestination({ name, destination: dest }))
                        }}
                        className={`cuve-dest-btn ${isDestSelected ? "active" : ""}`}
                        style={{ padding: "6px 12px", fontSize: "0.72rem", borderRadius: "4px" }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Destination & Actions Panel */}
              <div className="launch-actions">
                <span className="launch-actions-title">
                  2. Pilotage machine
                </span>

                {/* ATIA Dispatch Row */}
                {needsAtia && (
                  <div className="launch-row">
                    <span className="launch-row-label">ATIA</span>
                    {sent.atia ? (
                      <span className="launch-sent-ok">
                        ✓ Envoyé (OK)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => dispatch(launchCFToMachine({ name, machine: "atia" }))}
                        className="btn-launch-machine btn-atia"
                      >
                        Lancer sur ATIA
                      </button>
                    )}
                  </div>
                )}

                {/* GRUNWALD Dispatch Row */}
                {needsGrunwald && (
                  <div className="launch-row">
                    <span className="launch-row-label">GRUNWALD</span>
                    {sent.grunwald ? (
                      <span className="launch-sent-ok">
                        ✓ Envoyé (OK)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => dispatch(launchCFToMachine({ name, machine: "grunwald" }))}
                        className="btn-launch-machine btn-grunwald"
                      >
                        Lancer sur GRUN
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
