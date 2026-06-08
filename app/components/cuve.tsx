"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import {
  CF_TANKS,
  toggleCuveSelection,
  resetCuveSelection,
  autoFillCF,
} from "../lib/orderSlice"

export default function Cuve() {
  const dispatch = useDispatch()
  const { commands, activeCommandId } = useSelector((state: RootState) => state.order)

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  const volumeForCF = activeCommand.whiteMassKg

  // Calcule le volume distribué à chaque cuve sélectionnée en permettant plusieurs remplissages
  const allocatedVolumes: { [key: string]: number } = {}
  let remainingVolumeToDistribute = volumeForCF

  CF_TANKS.forEach((t) => { allocatedVolumes[t.name] = 0 })

  while (remainingVolumeToDistribute > 0) {
    let allocatedInCycle = false
    CF_TANKS.forEach((tank) => {
      if (activeCommand.selectedCFs.includes(tank.name) && remainingVolumeToDistribute > 0) {
        const take = Math.min(remainingVolumeToDistribute, tank.capacity)
        if (take > 0) {
          allocatedVolumes[tank.name] += take
          remainingVolumeToDistribute = Math.max(0, remainingVolumeToDistribute - take)
          allocatedInCycle = true
        }
      }
    })
    if (!allocatedInCycle) break
  }

  const selectedCapacity = activeCommand.selectedCFs.reduce((total, name) => {
    return total + (allocatedVolumes[name] || 0)
  }, 0)

  const remainingVolume = Math.max(0, volumeForCF - selectedCapacity)

  return (
    <div className="card">
      <h2>4. Stockage en cuves — {activeCommand.name}</h2>
      <div className="form-grid">
        <div>
          <span className="form-label" style={{ marginBottom: 12 }}>Cuves de stockage (sélection des cuves de maturation)</span>
          
          <div className="cuve-grid">
            {CF_TANKS.map((tank) => {
              const selected = activeCommand.selectedCFs.includes(tank.name)
              const isCF20 = tank.name === "CF20"
              const hasSkyr = activeCommand.references.some(r => r.name.toLowerCase().includes("skyr"))
              const hasClassic = activeCommand.references.some(r => !r.name.toLowerCase().includes("skyr"))

              const isDisabled = 
                !activeCommand.pasteurized ||
                (isCF20 && !hasSkyr) ||
                (!isCF20 && !hasClassic)

              return (
                <div
                  key={tank.name}
                  className={`cuve-card ${selected ? "active" : ""} ${isCF20 ? "cf20-card" : ""}`}
                  style={{ 
                    opacity: isDisabled ? 0.4 : 1,
                    border: isCF20 ? "1px dashed var(--violet)" : "1px solid var(--border-color)",
                    backgroundColor: isCF20 && selected ? "rgba(139, 92, 246, 0.08)" : "#ffffff"
                  }}
                  onClick={() => {
                    if (!isDisabled) {
                      dispatch(toggleCuveSelection(tank.name))
                    }
                  }}
                >
                  <div
                    style={{
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span className="cuve-title" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {tank.name}
                      {isCF20 && (
                        <span style={{ fontSize: "0.6rem", padding: "1px 4px", borderRadius: "3px", backgroundColor: "var(--violet)", color: "white", fontWeight: 700 }}>
                          Skyr
                        </span>
                      )}
                    </span>
                    <span className="cuve-capacity">
                      <span className="hide-mobile">Capacité : </span>{tank.capacity} L
                    </span>
                    {selected && (
                      <span className="cuve-volume" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span><span className="hide-mobile">Vol : </span>{allocatedVolumes[tank.name].toFixed(0)} L</span>
                        {Math.ceil(allocatedVolumes[tank.name] / tank.capacity) > 1 && (
                          <span style={{ fontSize: "0.85em", opacity: 0.9, fontWeight: 700 }}>
                            ({Math.ceil(allocatedVolumes[tank.name] / tank.capacity)} remplissages)
                          </span>
                        )}
                      </span>
                    )}
                    {commands.filter(c => c.selectedCFs.includes(tank.name)).length > 0 && (
                      <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", padding: "2px 4px", background: "var(--bg-app)", borderRadius: "var(--radius-sm)", marginTop: 4 }}>
                        <strong>Affecté à :</strong> {commands.filter(c => c.selectedCFs.includes(tank.name)).map(c => c.name).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="info-section">
          <div className="info-item">
            <span className="info-label">Volume assigné</span>
            <span className="info-value">{selectedCapacity.toFixed(1)} / {volumeForCF.toFixed(1)} L</span>
          </div>

          <div className="info-item">
            <span className="info-label">Volume restant</span>
            <span className="info-value" style={{ color: remainingVolume > 0 ? "var(--danger)" : "var(--success)" }}>
              {remainingVolume.toFixed(1)} L
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Masse blanche de la commande</span>
            <span className="info-value">{activeCommand.whiteMassKg.toFixed(1)} kg</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span className="status-text" style={{ margin: 0 }}>
              Cuves sélectionnées : {activeCommand.selectedCFs.length ? activeCommand.selectedCFs.join(", ") : "Aucune"}
            </span>
            <button
              type="button"
              onClick={() => dispatch(autoFillCF())}
              className="btn btn-secondary"
              style={{
                padding: "4px 10px",
                fontSize: "0.75rem",
                color: "var(--primary)",
                borderColor: "var(--primary-border)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                backgroundColor: "rgba(37, 99, 235, 0.05)",
                transition: "var(--transition)"
              }}
            >
              Remplissage automatique
            </button>
            {activeCommand.isCFManual && (
              <button
                type="button"
                onClick={() => dispatch(resetCuveSelection({ id: activeCommand.id }))}
                className="btn btn-secondary"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  color: "var(--primary)",
                  borderColor: "var(--primary-border)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "rgba(37, 99, 235, 0.05)",
                  transition: "var(--transition)"
                }}
              >
                🔄 Réinitialiser la sélection automatique
              </button>
            )}
          </div>
          <span className="status-text" style={{ margin: 0 }}>
            Statut : {activeCommand.status}
          </span>
        </div>
      </div>
    </div>
  )
}
