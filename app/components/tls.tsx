"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { autoFillTLS, TLS_TANKS, toggleTLSSelection } from "../lib/orderSlice"

export default function TLS() {
  const dispatch = useDispatch()
  const { commands, activeCommandId } = useSelector(
    (state: RootState) => state.order
  )

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  const selectedCapacity = activeCommand.selectedTLSs.reduce((total, name) => {
    const tank = TLS_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

  const remaining = Math.max(0, activeCommand.milkReceivedVolume - selectedCapacity)

  return (
    <div className="card">
      <h2>3. Réservoirs TLS (transfert) — {activeCommand.name}</h2>
      <div className="form-grid">
        <div>
          <span className="form-label">Tanks TLS</span>
          <div className="tank-grid">
            {TLS_TANKS.map((tank) => {
              const selected = activeCommand.selectedTLSs.includes(tank.name)
              return (
                <button
                  key={tank.name}
                  type="button"
                  onClick={() => dispatch(toggleTLSSelection(tank.name))}
                  disabled={activeCommand.milkReceivedVolume <= 0 && !selected}
                  className={`tank-button ${selected ? "active" : ""}`}
                >
                  {tank.name} ({tank.capacity} L)
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <button
            type="button"
            onClick={() => dispatch(autoFillTLS())}
            disabled={activeCommand.milkReceivedVolume <= 0}
            className="btn btn-secondary"
          >
            Remplissage automatique
          </button>
        </div>

        <div className="info-section">
          <div className="info-item">
            <span className="info-label">Volume TLS alloué</span>
            <span className="info-value">{selectedCapacity.toFixed(1)} / {activeCommand.milkReceivedVolume.toFixed(1)} L</span>
          </div>

          <div className="info-item">
            <span className="info-label">Volume restant</span>
            <span className="info-value" style={{ color: remaining > 0 ? "var(--danger)" : "var(--success)" }}>
              {remaining.toFixed(1)} L
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Temps transfert estimé</span>
            <span className="info-value">{activeCommand.timing.transferTime.toFixed(1)} min</span>
          </div>
        </div>

        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", marginTop: 4 }}>
          * Vitesse de transfert TLC ➔ TLS : 20 min pour 5 200 L de lait cru (s&apos;ajuste proportionnellement).
        </p>

        <div style={{ backgroundColor: "#f8fafc", padding: 12, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", marginTop: 8 }}>
          <span className="info-label" style={{ display: "block", marginBottom: 4 }}>Répartition automatique</span>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
            TLS1: {activeCommand.tlsVolumes.tls1.toFixed(1)} L — TLS2: {activeCommand.tlsVolumes.tls2.toFixed(1)} L — TLS3: {activeCommand.tlsVolumes.tls3.toFixed(1)} L
          </p>
        </div>
      </div>
    </div>
  )
}
