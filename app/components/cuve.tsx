"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import {
  CF_TANKS,
  toggleCuveSelection,
} from "../lib/orderSlice"

export default function Cuve() {
  const dispatch = useDispatch()
  const { commands, activeCommandId } = useSelector((state: RootState) => state.order)

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  const selectedCapacity = activeCommand.selectedCFs.reduce((total, name) => {
    const tank = CF_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

  const volumeForCF = activeCommand.osmosedVolume
  const remainingVolume = Math.max(0, volumeForCF - selectedCapacity)

  // Calcule le volume distribué à chaque cuve sélectionnée
  const allocatedVolumes: { [key: string]: number } = {}
  let remainingVolumeToDistribute = volumeForCF

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
      <h2>4. Stockage en cuves — {activeCommand.name}</h2>
      <div className="form-grid">
        <div>
          <span className="form-label" style={{ marginBottom: 12 }}>Cuves de stockage (sélection des cuves de maturation)</span>
          
          <div className="cuve-grid">
            {CF_TANKS.map((tank) => {
              const selected = activeCommand.selectedCFs.includes(tank.name)
              const isDisabled = !activeCommand.pasteurized || (!selected && selectedCapacity >= volumeForCF)

              return (
                <div
                  key={tank.name}
                  className={`cuve-card ${selected ? "active" : ""}`}
                  style={{ opacity: isDisabled ? 0.5 : 1 }}
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
                    <span className="cuve-title">
                      {tank.name}
                    </span>
                    <span className="cuve-capacity">
                      Capacité : {tank.capacity} L
                    </span>
                    {selected && (
                      <span className="cuve-volume">
                        Vol: {allocatedVolumes[tank.name].toFixed(1)} L
                      </span>
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

        <div style={{ marginTop: 8 }}>
          <span className="status-text" style={{ marginRight: 8 }}>
            Cuves sélectionnées : {activeCommand.selectedCFs.length ? activeCommand.selectedCFs.join(", ") : "Aucune"}
          </span>
          <span className="status-text">
            Statut : {activeCommand.status}
          </span>
        </div>
      </div>
    </div>
  )
}
