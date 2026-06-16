"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../lib/store"
import { TLC_TANKS, getTLCStats, milkTypeConfigs, receiveMilkOrder } from "../lib/orderSlice"
import { ExecutionCards } from "./ExecutionCards"



export default function Journee() {
  const dispatch = useDispatch()
  const { commands, tlcBatches, milkOrders } = useSelector((state: RootState) => state.order)

  const [receptionTank, setReceptionTank] = useState<"tlc1" | "tlc2" | "tlc3" | "tlc4" | "tankPermeat" | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [realQty, setRealQty] = useState("30000")
  
  const pendingOrders = milkOrders.filter(o => o.status === "pending").sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())

  const handleReceiveOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId || !receptionTank) {
      alert("Veuillez sélectionner une commande.")
      return
    }

    const order = milkOrders.find(o => o.id === selectedOrderId)
    const d = new Date()
    const lotNumber = `${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`

    dispatch(receiveMilkOrder({
      orderId: selectedOrderId,
      tank: receptionTank,
      isComplete: true,
      batchData: {
        lotNumber,
        volume: Number(realQty),
        protein: 33.0,
        fat: 38.0,
        deliveryDate: d.getTime(),
        temperature: 4.0,
        snapTest: true,
        ph: 6.7,
        aciditeDornic: 16.0,
        litrageBL: Number(realQty),
        fcv3Mp: order?.milkType === "fcv3" ? 34.0 : undefined
      }
    }))
    
    setReceptionTank(null)
    setSelectedOrderId("")
  }

  // Encart avec la quantité de masse blanche à faire (déduit de ce qui est produit)
  const totalWhiteMass = commands.reduce((acc, cmd) => acc + Math.max(0, (cmd.whiteMassKg || 0) - (cmd.producedWhiteMass || 0)), 0)
  
  const whiteMassBreakdown: Record<string, number> = {}
  commands.forEach(cmd => {
    const remainingForCmd = Math.max(0, (cmd.whiteMassKg || 0) - (cmd.producedWhiteMass || 0))
    if (remainingForCmd <= 0) return

    let skyrMass = 0
    cmd.references.forEach(r => {
      if (r.name.toLowerCase().includes("skyr")) {
        skyrMass += (r.potsQty * (r.gramPerPot || 125)) / 1000
      }
    })
    
    // Scale proportionally if partially produced
    const ratio = remainingForCmd / (cmd.whiteMassKg || 1)
    skyrMass = skyrMass * ratio
    
    const classicMass = remainingForCmd - skyrMass
    
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
              <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "0.95rem" }}>Total RESTANT à produire (déduit des pasteurisations)</p>
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary-dark)" }}>
              {totalWhiteMass.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L
            </div>
          </div>
          
          {Object.keys(whiteMassBreakdown).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", borderTop: "1px solid rgba(59, 130, 246, 0.2)", paddingTop: "16px" }}>
              {Object.entries(whiteMassBreakdown).map(([type, mass]) => (
                <div key={type} style={{ background: "#fff", padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-border)", display: "flex", alignItems: "center", gap: "12px", boxShadow: "var(--shadow-sm)" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{type}</span>
                  <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "1.1rem" }}>{mass.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L</span>
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
                  <div style={{ width: `${Math.min(pct, 100)}%`, background: stats.volume > tank.capacity ? "#ef4444" : (batches.length > 0 ? config.color : "transparent"), height: "100%", transition: "width 0.3s ease" }} />
                </div>
                <div style={{ fontSize: "0.95rem", textAlign: "right", color: "var(--text-main)" }}>
                  <strong>{stats.volume.toLocaleString("fr-FR")} L</strong> / {tank.capacity.toLocaleString()} L
                </div>
                <button
                  onClick={() => setReceptionTank(tank.key as any)}
                  className="btn btn-success"
                  style={{ marginTop: "8px", width: "100%", padding: "8px", fontSize: "0.85rem", fontWeight: "bold", borderRadius: "6px" }}
                >
                  🥛 Réceptionner du lait
                </button>
              </div>
            )
          })}
        </div>

        <ExecutionCards />

        {/* RECEPTION MODAL */}
        {receptionTank && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "var(--radius-lg)", maxWidth: "500px", width: "100%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
              <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--primary)" }}>Réception rapide ({TLC_TANKS.find(t => t.key === receptionTank)?.name})</h3>
              
              {pendingOrders.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Aucune commande de lait en attente. Allez dans l&apos;onglet Réception pour en ajouter une.
                </div>
              ) : (
                <form onSubmit={handleReceiveOrder} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Commande à réceptionner
                    <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)} required style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                      <option value="" disabled>-- Sélectionner --</option>
                      {pendingOrders.map(o => (
                        <option key={o.id} value={o.id}>{o.supplier} - {o.milkType} - {o.quantity}L</option>
                      ))}
                    </select>
                  </label>
                  
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Quantité réelle (L)
                    <input type="number" value={realQty} onChange={(e) => setRealQty(e.target.value)} required min="1" style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
                  </label>

                  <div style={{ display: "flex", gap: "12px", marginTop: "16px", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setReceptionTank(null)} className="btn btn-secondary" style={{ padding: "8px 16px" }}>Annuler</button>
                    <button type="submit" className="btn btn-success" style={{ padding: "8px 16px" }}>Valider la réception</button>
                  </div>
                </form>
              )}
              {pendingOrders.length === 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  <button onClick={() => setReceptionTank(null)} className="btn btn-secondary" style={{ padding: "8px 16px" }}>Fermer</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
