"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { autoFillTLS, TLS_TANKS, toggleTLSSelection } from "../lib/orderSlice"

export default function TLS() {
  const dispatch = useDispatch()
  const { milkReceivedVolume, tlsVolumes, selectedTLSs } = useSelector(
    (state: RootState) => state.order
  )

  const selectedCapacity = selectedTLSs.reduce((total, name) => {
    const tank = TLS_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

  const remaining = Math.max(0, milkReceivedVolume - selectedCapacity)

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>2.1. Sélection des TLS</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        <div>
          <strong>Tanks TLS</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {TLS_TANKS.map((tank) => {
              const selected = selectedTLSs.includes(tank.name)
              return (
                <button
                  key={tank.name}
                  type="button"
                  onClick={() => dispatch(toggleTLSSelection(tank.name))}
                  disabled={milkReceivedVolume <= 0 && !selected}
                  style={{
                    padding: 10,
                    border: selected ? "2px solid #0070f3" : "1px solid #ccc",
                    background: selected ? "#e6f0ff" : "white",
                    cursor: milkReceivedVolume > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  {tank.name} ({tank.capacity} L)
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => dispatch(autoFillTLS())}
            disabled={milkReceivedVolume <= 0}
            style={{ padding: 10 }}
          >
            Remplissage automatique
          </button>
        </div>

        <div>
          <strong>Volume TLS alloué</strong>
          <p>{selectedCapacity.toFixed(3)} / {milkReceivedVolume.toFixed(3)} L</p>
          <p>Volume restant : {remaining.toFixed(3)} L</p>
        </div>

        <div>
          <strong>Répartition automatique (si demandée)</strong>
          <p>TLS1: {tlsVolumes.tls1.toFixed(3)} L — TLS2: {tlsVolumes.tls2.toFixed(3)} L — TLS3: {tlsVolumes.tls3.toFixed(3)} L</p>
        </div>
      </div>
    </div>
  )
}
