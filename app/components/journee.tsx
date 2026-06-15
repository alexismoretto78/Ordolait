"use client"

import { useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { TLC_TANKS, getTLCStats, CF_TANKS, TLS_TANKS, milkTypeConfigs } from "../lib/orderSlice"
import { ExecutionCards } from "./ExecutionCards"



export default function Journee() {
  const { commands, tlcBatches } = useSelector((state: RootState) => state.order)

  // Encart avec la quantité de masse blanche à faire
  const totalWhiteMass = commands.reduce((acc, cmd) => acc + cmd.whiteMassKg, 0)
  
  const whiteMassBreakdown: Record<string, number> = {}
  commands.forEach(cmd => {
    let skyrMass = 0
    cmd.references.forEach(r => {
      if (r.name.toLowerCase().includes("skyr")) {
        skyrMass += (r.potsQty * r.gramPerPot) / 1000
      }
    })
    
    const classicMass = cmd.whiteMassKg - skyrMass
    
    if (skyrMass > 0) {
      const skyrType = cmd.skyrMilkType || 'fcv3'
      const key = `Skyr (${skyrType === 'fcv3' ? 'FCV3' : skyrType === 'ecreme_savoie' ? 'Écrémé Savoie' : skyrType === 'ecreme_montagne' ? 'Écrémé Montagne' : skyrType})`
      whiteMassBreakdown[key] = (whiteMassBreakdown[key] || 0) + skyrMass
    }
    
    if (classicMass > 0) {
      const typeStr = cmd.milkType === 'bio' ? 'Bio' : 
           cmd.milkType === 'fcv3' ? 'FCV3' : 
           cmd.milkType === 'savoie' ? 'Savoie' : 
           cmd.milkType === 'montagne' ? 'Montagne' : 
           cmd.milkType === 'creme' ? 'Crème' : 
           cmd.milkType === 'ecreme_savoie' ? 'Écrémé Savoie' : 
           cmd.milkType === 'ecreme_montagne' ? 'Écrémé Montagne' : 
           cmd.milkType
      whiteMassBreakdown[typeStr] = (whiteMassBreakdown[typeStr] || 0) + classicMass
    }
  })

  // TLS and CF dynamic state calculations have been moved to ExecutionCards and orderSlice

  return (
    <div className="module-card">
      <div className="module-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2>📊 Tableau de bord</h2>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Encart Masse Blanche */}
        <div style={{ background: "var(--primary-light)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--primary-border)", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--primary)", fontSize: "1.2rem" }}>Quantité de masse blanche à faire</h3>
              <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "0.95rem" }}>Total calculé pour toutes les commandes ({commands.length})</p>
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary-dark)" }}>
              {totalWhiteMass.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} kg
            </div>
          </div>
          
          {Object.keys(whiteMassBreakdown).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", borderTop: "1px solid rgba(59, 130, 246, 0.2)", paddingTop: "16px" }}>
              {Object.entries(whiteMassBreakdown).map(([type, mass]) => (
                <div key={type} style={{ background: "#fff", padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-border)", display: "flex", alignItems: "center", gap: "12px", boxShadow: "var(--shadow-sm)" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{type}</span>
                  <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "1.1rem" }}>{mass.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} kg</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TLC */}
        <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", color: "var(--text-main)", marginTop: "32px", fontSize: "1.1rem" }}>État des TLC</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {TLC_TANKS.map(tank => {
            const batches = tlcBatches[tank.key as keyof typeof tlcBatches]
            const stats = getTLCStats(batches)
            const typeStr = batches.length > 0 ? batches[0].milkType : "Vide"
            const config = milkTypeConfigs[typeStr] || milkTypeConfigs["bio"]
            const pct = Math.max(0, (stats.volume / tank.capacity) * 100)

            return (
              <div key={tank.key} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "16px", background: "#fff", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "1.1rem" }}>{tank.name}</strong>
                  {batches.length > 0 ? (
                    <span style={{ fontSize: "0.85rem", background: "var(--bg-app)", padding: "4px 8px", borderRadius: "6px", fontWeight: 600 }}>{config.emoji} {config.label || typeStr}</span>
                  ) : (
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>Vide</span>
                  )}
                </div>
                <div style={{ width: "100%", background: "#f1f5f9", height: "10px", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, background: batches.length > 0 ? config.color : "transparent", height: "100%", transition: "width 0.3s ease" }} />
                </div>
                <div style={{ fontSize: "0.95rem", textAlign: "right", color: "var(--text-main)" }}>
                  <strong>{stats.volume.toLocaleString("fr-FR")} L</strong> / {tank.capacity.toLocaleString()} L
                </div>
              </div>
            )
          })}
        </div>

        <ExecutionCards />
      </div>
    </div>
  )
}
