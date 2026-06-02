"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { autoFillTLS, TLS_TANKS, toggleTLSSelection } from "../lib/orderSlice"

export default function TLS() {
  const dispatch = useDispatch()
  const { commands, activeCommandId, tlcBatches } = useSelector(
    (state: RootState) => state.order
  )

  const activeCommand = commands.find(c => c.id === activeCommandId) || commands[0]

  const hasSkyr = activeCommand.references.some(r => r.name.toLowerCase().includes("skyr"))
  const hasClassic = activeCommand.references.some(r => !r.name.toLowerCase().includes("skyr"))
  const isDirectSkyr = hasSkyr && activeCommand.skyrMilkType === "fcv3" && activeCommand.skyrDirectPasto

  // Calculate classic milk volume if direct Skyr is mixed with classic
  let classicMilkReceivedVolume = activeCommand.milkReceivedVolume
  let skyrMilkReceivedVolume = activeCommand.milkReceivedVolume
  if (isDirectSkyr && hasClassic) {
    const classicWhiteMass = activeCommand.references
      .filter(r => !r.name.toLowerCase().includes("skyr"))
      .reduce((sum, r) => sum + (r.potsQty * r.gramPerPot) / 1000, 0)
    
    const classicRequiredType = activeCommand.milkType || "bio"
    let classicTotalVol = 0
    let classicTotalProt = 0
    const keys: (keyof typeof tlcBatches)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
    keys.forEach(k => {
      tlcBatches[k].forEach(b => {
        if (b.milkType === classicRequiredType) {
          classicTotalVol += b.volume
          classicTotalProt += b.volume * b.protein
        }
      })
    })
    const classicCi = classicTotalVol > 0 ? classicTotalProt / classicTotalVol : 33.0
    if (classicCi > 0) {
      classicMilkReceivedVolume = (classicWhiteMass * activeCommand.targetValue) / classicCi
    }
    skyrMilkReceivedVolume = activeCommand.milkReceivedVolume - classicMilkReceivedVolume
  } else if (!hasSkyr) {
    skyrMilkReceivedVolume = 0
  } else if (hasSkyr && hasClassic) {
    const skyrWhiteMass = activeCommand.references
      .filter(r => r.name.toLowerCase().includes("skyr"))
      .reduce((sum, r) => sum + (r.potsQty * r.gramPerPot) / 1000, 0)
    const skyrRequiredType = activeCommand.skyrMilkType === "fcv3" ? "fcv3" : (activeCommand.skyrMilkType === "ecreme_savoie" ? "savoie" : "montagne")
    let skyrTotalVol = 0
    let skyrTotalProt = 0
    const keys: (keyof typeof tlcBatches)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
    keys.forEach(k => {
      tlcBatches[k].forEach(b => {
        if (b.milkType === skyrRequiredType) {
          skyrTotalVol += b.volume
          skyrTotalProt += b.volume * b.protein
        }
      })
    })
    const skyrCi = skyrTotalVol > 0 ? skyrTotalProt / skyrTotalVol : 33.0
    if (skyrCi > 0) {
      skyrMilkReceivedVolume = (skyrWhiteMass * activeCommand.targetValue) / skyrCi
    }
    classicMilkReceivedVolume = activeCommand.milkReceivedVolume - skyrMilkReceivedVolume
  }

  const volumeForTLS = isDirectSkyr ? classicMilkReceivedVolume : activeCommand.milkReceivedVolume

  const selectedCapacity = activeCommand.selectedTLSs.reduce((total, name) => {
    const tank = TLS_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

  const remaining = Math.max(0, volumeForTLS - selectedCapacity)

  if (isDirectSkyr && !hasClassic) {
    return (
      <div className="card" style={{ borderLeft: "4px solid var(--primary)" }}>
        <h2>3. Réservoirs TLS (transfert) — {activeCommand.name}</h2>
        <div style={{ padding: "30px 10px", textAlign: "center" }}>
          <span style={{ fontSize: "2.8rem" }}>⚡</span>
          <h3 style={{ color: "var(--primary)", marginTop: 12, fontSize: "1.2rem", fontWeight: 800 }}>
            Pasteurisation en direct (Sans TLS)
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "440px", margin: "8px auto 0 auto", lineHeight: 1.4 }}>
            Cette commande de Skyr avec lait FCV3 est pasteurisée en direct. Le lait est transféré directement de la réception vers la pasteurisation puis la cuve CF20, sans occuper ni transiter par les réservoirs TLS.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>3. Réservoirs TLS (transfert) — {activeCommand.name}</h2>
      <div className="form-grid">
        {/* Banner for mixed direct Skyr */}
        {isDirectSkyr && hasClassic && (
          <div style={{
            gridColumn: "span 2",
            backgroundColor: "rgba(37, 99, 235, 0.05)",
            border: "1px solid rgba(37, 99, 235, 0.15)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderLeft: "4px solid var(--primary)"
          }}>
            <span style={{ fontSize: "1.2rem" }}>⚡</span>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--primary)", fontWeight: 700, lineHeight: 1.4 }}>
              Les produits Skyr de cette commande (Lait FCV3) sont pasteurisés en direct sans passer par les TLS. 
              Les réservoirs TLS ci-dessous sont dédiés uniquement à la production classique de yaourts ({classicMilkReceivedVolume.toFixed(1)} L).
            </p>
          </div>
        )}

        {/* Retentate Tank Section for Skimmed Milk */}
        {hasSkyr && (activeCommand.skyrMilkType === "ecreme_savoie" || activeCommand.skyrMilkType === "ecreme_montagne") && (
          <div style={{
            gridColumn: "span 2",
            backgroundColor: "rgba(139, 92, 246, 0.04)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            marginBottom: "8px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            position: "relative",
            borderLeft: "4px solid var(--violet)"
          }}>
            {/* Graphic Cylinder */}
            <div style={{
              position: "relative",
              width: "60px",
              height: "80px",
              background: "#ffffff",
              borderRadius: "10px 10px 14px 14px",
              border: "2px solid #cbd5e1",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end"
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)",
                borderRadius: "0 0 4px 4px"
              }} />
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "white"
              }}>
                100%
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "#1e293b", fontWeight: 700 }}>
                🧪 Tank Retentat (Stockage Lait Écrémé)
              </h4>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                Contient le lait écrémé à partir du lait cru de {activeCommand.skyrMilkType === "ecreme_savoie" ? "Savoie 🏔️" : "Montagne ⛰️"}. Le volume de <strong>{skyrMilkReceivedVolume.toFixed(1)} L</strong> est stocké et prêt à être transféré dans les réservoirs TLS.
              </p>
            </div>
          </div>
        )}

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
                  disabled={volumeForTLS <= 0 && !selected}
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
            disabled={volumeForTLS <= 0}
            className="btn btn-secondary"
          >
            Remplissage automatique
          </button>
        </div>

        <div className="info-section">
          <div className="info-item">
            <span className="info-label">Volume TLS alloué</span>
            <span className="info-value">{selectedCapacity.toFixed(1)} / {volumeForTLS.toFixed(1)} L</span>
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
