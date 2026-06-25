"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../lib/store"
import { TLC_TANKS, TLS_TANKS, CF_TANKS, getTLCStats, milkTypeConfigs, receiveMilkOrder, initTlsTransfer, validateTlsTransferEnd, initDirectTlcPasto } from "../lib/orderSlice"
import { saveCompletedReception } from "../lib/dbSync"
import { ExecutionCards } from "./ExecutionCards"



export default function Journee() {
  const dispatch = useDispatch()
  const { commands, tlcBatches, milkOrders } = useSelector((state: RootState) => state.order)

  const [receptionTank, setReceptionTank] = useState<"tlc1" | "tlc2" | "tlc3" | "tlc4" | "tankPermeat" | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [realQty, setRealQty] = useState("30000")

  const [quickTransferType, setQuickTransferType] = useState<string | null>(null);
  const [quickTransferCmdId, setQuickTransferCmdId] = useState<string>("");
  const [quickTransferVol, setQuickTransferVol] = useState<number>(0);
  const [quickTransferTlc, setQuickTransferTlc] = useState<string>("");
  const [quickTransferTlsList, setQuickTransferTlsList] = useState<string[]>([]);
  const [quickTransferCf, setQuickTransferCf] = useState<string>("CF20");
  
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

    const batchData = {
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
    };

    saveCompletedReception({
      ...batchData,
      milkType: order?.milkType || "bio",
    });

    dispatch(receiveMilkOrder({
      orderId: selectedOrderId,
      tank: receptionTank,
      isComplete: true,
      batchData
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
                <div 
                  key={type} 
                  onClick={() => {
                    setQuickTransferType(type);
                    setQuickTransferVol(Math.round(mass));
                    
                    // Find first matching command
                    const matchingCmd = commands.find(cmd => {
                      if (type.startsWith("Skyr")) {
                        if (!cmd.isSkyr) return false;
                        const skyrType = cmd.skyrMilkType || 'fcv3';
                        const key = `Skyr (${skyrType === 'fcv3' ? 'FCV3' : skyrType === 'ecreme_savoie' ? 'Écrémé Savoie' : skyrType === 'ecreme_montagne' ? 'Écrémé Montagne' : skyrType})`;
                        return key === type;
                      } else {
                        if (cmd.isSkyr) return false;
                        const typeStr = cmd.milkType === 'bio' ? 'Bio' : 
                                      cmd.milkType === 'fcv3' ? 'FCV3' : 
                                      cmd.milkType === 'savoie' ? 'Savoie' : 
                                      cmd.milkType === 'montagne' ? 'Montagne' : 
                                      cmd.milkType === 'creme' ? 'Crème' : 
                                      cmd.milkType === 'ecreme_savoie' ? 'Écrémé Savoie' : 
                                      cmd.milkType === 'ecreme_montagne' ? 'Écrémé Montagne' : 
                                      cmd.milkType;
                        return typeStr === type;
                      }
                    });
                    
                    if (matchingCmd) {
                      setQuickTransferCmdId(matchingCmd.id);
                    } else {
                      setQuickTransferCmdId("");
                    }
                    
                    // Find best TLC
                    let bestTlc = "";
                    let oldestDate = Infinity;
                    const requiredMilkType = type.startsWith("Skyr") 
                      ? (type.includes("Savoie") ? "ecreme_savoie" : type.includes("Montagne") ? "ecreme_montagne" : "fcv3")
                      : (type === "Bio" ? "bio" : type === "FCV3" ? "fcv3" : type === "Savoie" ? "savoie" : type === "Montagne" ? "montagne" : type === "Crème" ? "creme" : type === "Écrémé Savoie" ? "ecreme_savoie" : type === "Écrémé Montagne" ? "ecreme_montagne" : "bio");
                    
                    Object.entries(tlcBatches).forEach(([key, batches]) => {
                      if (key === "tankPermeat") return;
                      batches.forEach(b => {
                        if (b.milkType === requiredMilkType && b.volume > 0 && b.deliveryDate < oldestDate) {
                          oldestDate = b.deliveryDate;
                          bestTlc = key;
                        }
                      });
                    });
                    if (!bestTlc) {
                      const tlc = TLC_TANKS.find(t => tlcMilkTypes[t.key as keyof typeof tlcMilkTypes] === requiredMilkType);
                      if (tlc) bestTlc = tlc.key;
                    }
                    setQuickTransferTlc(bestTlc || "tlc1");
                  }}
                  style={{ cursor: "pointer", background: "#fff", padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-border)", display: "flex", alignItems: "center", gap: "12px", boxShadow: "var(--shadow-sm)", transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
                  title="Cliquez pour lancer un transfert vers TLS"
                >
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>Total {type}</span>
                  <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "1.1rem" }}>{mass.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} kg</span>
                </div>
              ))}
            </div>
          )}

          {commands.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(59, 130, 246, 0.2)", paddingTop: "16px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "var(--primary-dark)" }}>Détail par commande :</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                {commands.map(cmd => {
                  const remaining = Math.max(0, (cmd.whiteMassKg || 0) - (cmd.producedWhiteMass || 0))
                  if (remaining <= 0) return null;
                  return (
                    <div key={cmd.id} style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
                      <span style={{ fontWeight: 600 }}>
                        {cmd.name} 
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "normal", marginLeft: "6px" }}>
                          ({cmd.isSkyr ? "Skyr" : cmd.milkType?.replace(/_/g, " ") || "Non défini"})
                        </span>
                      </span>
                      <span style={{ fontWeight: 800, color: "var(--primary-dark)" }}>{remaining.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} kg</span>
                    </div>
                  )
                })}
              </div>
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
        {/* QUICK TRANSFER MODAL */}
        {quickTransferType && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "var(--radius-lg)", maxWidth: "500px", width: "100%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
              <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--primary)" }}>Transfert Rapide : {quickTransferType}</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!quickTransferCmdId) { alert("Veuillez sélectionner une commande"); return; }
                
                const type = quickTransferType || "";
                const isSkyrBase = ["FCV3", "Écrémé Savoie", "Écrémé Montagne"].includes(type) || type.startsWith("Skyr");

                if (isSkyrBase) {
                  dispatch(initDirectTlcPasto({
                    cfName: quickTransferCf,
                    commandId: quickTransferCmdId,
                    tlcKey: quickTransferTlc,
                    volume: quickTransferVol,
                  }));
                } else {
                  if (quickTransferTlsList.length === 0) { alert("Veuillez sélectionner au moins une cuve TLS"); return; }
                  
                  let remainingVol = quickTransferVol;

                  quickTransferTlsList.forEach(tlsName => {
                    if (remainingVol <= 0) return;
                    const tlsConfig = TLS_TANKS.find(t => t.name === tlsName);
                    const capacity = tlsConfig ? tlsConfig.capacity : 5200;
                    const volumeForTls = Math.round(Math.min(capacity, remainingVol));
                    
                    dispatch(initTlsTransfer({
                      tlsName,
                      commandId: quickTransferCmdId,
                      volume: volumeForTls,
                      tlcDeductions: [{ tlcKey: quickTransferTlc, volume: volumeForTls }]
                    }));
                    // Immediately validate to fill the TLS
                    dispatch(validateTlsTransferEnd({ tlsName }));
                    
                    remainingVol -= volumeForTls;
                  });
                }
                
                setQuickTransferType(null);
              }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                  Commande associée
                  <select value={quickTransferCmdId} onChange={(e) => setQuickTransferCmdId(e.target.value)} required style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                    <option value="" disabled>-- Sélectionner --</option>
                    {commands.filter(cmd => {
                      const type = quickTransferType || "";
                      const isSkyrBase = ["FCV3", "Écrémé Savoie", "Écrémé Montagne"].includes(type) || type.startsWith("Skyr");
                      if (isSkyrBase) {
                        return cmd.isSkyr;
                      } else if (type === "Montagne") {
                        return !cmd.isSkyr && (cmd.name.toLowerCase().includes("baiko") || cmd.name.toLowerCase().includes("mdd"));
                      } else if (type === "Savoie") {
                        return !cmd.isSkyr;
                      } else {
                        return !cmd.isSkyr;
                      }
                    }).map(cmd => (
                      <option key={cmd.id} value={cmd.id}>
                        {cmd.name} ({cmd.isSkyr ? "Skyr" : cmd.milkType?.replace(/_/g, " ") || "Non défini"})
                      </option>
                    ))}
                  </select>
                </label>

                <div style={{ display: "flex", gap: "16px" }}>
                  <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Source (TLC)
                    <select value={quickTransferTlc} onChange={(e) => setQuickTransferTlc(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                      {TLC_TANKS.filter(t => t.key !== "tankPermeat").map(t => (
                        <option key={t.key} value={t.key}>{t.name} ({(tlcBatches[t.key as keyof typeof tlcBatches]?.reduce((s,b)=>s+b.volume,0)||0)}L)</option>
                      ))}
                    </select>
                  </label>

                  {(() => {
                    const type = quickTransferType || "";
                    const isSkyrBase = ["FCV3", "Écrémé Savoie", "Écrémé Montagne"].includes(type) || type.startsWith("Skyr");
                    if (isSkyrBase) {
                      return (
                        <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                          Destination (Pasteurisation Directe vers CF)
                          <select value={quickTransferCf} onChange={(e) => setQuickTransferCf(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                            {CF_TANKS.map(t => (
                              <option key={t.name} value={t.name}>{t.name} (Capacité: {t.capacity}L)</option>
                            ))}
                          </select>
                        </label>
                      )
                    } else {
                      return (
                        <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                          Destinations (TLS) - Multi-sélection (Ctrl+Clic)
                          <select 
                            multiple 
                            value={quickTransferTlsList} 
                            onChange={(e) => {
                              const values = Array.from(e.target.selectedOptions, option => option.value);
                              setQuickTransferTlsList(values);
                            }} 
                            style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)", minHeight: "80px" }}
                            required
                          >
                            {TLS_TANKS.map(t => (
                              <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        </label>
                      )
                    }
                  })()}
                </div>

                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                  Volume total à transférer (L)
                  <input type="number" value={quickTransferVol} onChange={(e) => setQuickTransferVol(Number(e.target.value))} required min="1" style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
                  {quickTransferTlsList.length > 1 && !(["FCV3", "Écrémé Savoie", "Écrémé Montagne"].includes(quickTransferType || "") || (quickTransferType || "").startsWith("Skyr")) && (
                    <span style={{ fontSize: "0.8rem", color: "var(--primary)" }}>
                      La quantité sera répartie selon la capacité maximale de chaque cuve sélectionnée.
                    </span>
                  )}
                </label>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setQuickTransferType(null)} className="btn btn-secondary" style={{ padding: "8px 16px" }}>Annuler</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px" }}>Lancer le transfert</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
