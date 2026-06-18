"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { TLC_TANKS, addMilkOrder, receiveMilkOrder, getTLCStats, MilkType } from "../lib/orderSlice"

const milkTypeConfigs: Record<string, any> = {
  bio: { label: "Bio", color: "var(--success)", gradient: "linear-gradient(180deg, #86efac 0%, #22c55e 100%)", emoji: "🌱" },
  fcv3: { label: "FCV3", color: "var(--primary)", gradient: "linear-gradient(180deg, #93c5fd 0%, #3b82f6 100%)", emoji: "🐄" },
  savoie: { label: "Savoie", color: "var(--info)", gradient: "linear-gradient(180deg, #67e8f9 0%, #06b6d4 100%)", emoji: "🏔️" },
  montagne: { label: "Montagne", color: "var(--violet)", gradient: "linear-gradient(180deg, #c4b5fd 0%, #8b5cf6 100%)", emoji: "⛰️" },
  creme: { label: "Crème", color: "var(--danger)", gradient: "linear-gradient(180deg, #fca5a5 0%, #ef4444 100%)", emoji: "🧈" },
  ecreme_savoie: { label: "Écrémé Savoie", color: "var(--warning)", gradient: "linear-gradient(180deg, #fde68a 0%, #f59e0b 100%)", emoji: "💧" },
  ecreme_montagne: { label: "Écrémé Montagne", color: "var(--violet)", gradient: "linear-gradient(180deg, #ddd6fe 0%, #8b5cf6 100%)", emoji: "💧" }
}

export default function TLC() {
  const dispatch = useDispatch()
  const { tlcBatches, milkOrders } = useSelector((state: RootState) => state.order)

  const [activeSubTab, setActiveSubTab] = useState<"commande" | "ajouter" | "reception" | "gestion" | "recues">("commande")

  // State for Add Milk Order
  const [newOrderType, setNewOrderType] = useState<MilkType>("bio")
  const [newOrderSupplier, setNewOrderSupplier] = useState("")
  const [newOrderDate, setNewOrderDate] = useState(new Date().toISOString().slice(0, 16))
  const [newOrderQty, setNewOrderQty] = useState("30000")

  // State for Reception
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [destTank, setDestTank] = useState<"tlc1" | "tlc2" | "tlc3" | "tlc4" | "tankPermeat">("tlc1")
  const [receptionDate, setReceptionDate] = useState(new Date().toISOString().slice(0, 16))
  
  // Control Popup State
  const [showControlPopup, setShowControlPopup] = useState(false)
  const [controlTemp, setControlTemp] = useState("4.0")
  const [controlSnap, setControlSnap] = useState(true)
  const [controlPh, setControlPh] = useState("6.7")
  const [controlFcv3Mp, setControlFcv3Mp] = useState("34.0")
  const [controlLitrageBL, setControlLitrageBL] = useState("30000")
  const [controlMg, setControlMg] = useState("38.0")
  const [controlMp, setControlMp] = useState("33.0")
  const [controlAcidite, setControlAcidite] = useState("16.0")
  const [realQty, setRealQty] = useState("30000")
  const [closeOrder, setCloseOrder] = useState(true)

  useEffect(() => {
    const order = milkOrders.find(o => o.id === selectedOrderId)
    if (order) {
      const currentRec = order.receivedQuantity || 0
      const newTotal = currentRec + Number(realQty)
      setCloseOrder(newTotal >= order.quantity)
    }
  }, [realQty, selectedOrderId, milkOrders])

  const pendingOrders = milkOrders.filter(o => o.status === "pending").sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
  const receivedOrders = milkOrders.filter(o => o.status === "received").sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(addMilkOrder({
      milkType: newOrderType,
      supplier: newOrderSupplier,
      scheduledDate: newOrderDate,
      quantity: Number(newOrderQty)
    }))
    setActiveSubTab("commande")
    setNewOrderSupplier("")
  }

  const handleReceiveOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId) {
      alert("Veuillez sélectionner une commande de lait à réceptionner.")
      return
    }

    const order = milkOrders.find(o => o.id === selectedOrderId)
    
    // Generate Lot Number from receptionDate
    const d = new Date(receptionDate)
    const lotNumber = `${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`

    dispatch(receiveMilkOrder({
      orderId: selectedOrderId,
      tank: destTank,
      isComplete: closeOrder,
      batchData: {
        lotNumber,
        volume: Number(realQty),
        protein: Number(controlMp),
        fat: Number(controlMg),
        deliveryDate: d.getTime(),
        temperature: Number(controlTemp),
        snapTest: controlSnap,
        ph: Number(controlPh),
        aciditeDornic: Number(controlAcidite),
        litrageBL: Number(controlLitrageBL),
        fcv3Mp: order?.milkType === "fcv3" ? Number(controlFcv3Mp) : undefined
      }
    }))
    
    setShowControlPopup(false)
    setSelectedOrderId("")
    setActiveSubTab("gestion")
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.8rem" }}>🥛</span>
          <h2 style={{ margin: 0 }}>Réception de Lait (TLC/TLP)</h2>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
        <button onClick={() => setActiveSubTab("commande")} className={`btn ${activeSubTab === "commande" ? "btn-primary" : "btn-secondary"}`}>Commandes à venir</button>
        <button onClick={() => setActiveSubTab("ajouter")} className={`btn ${activeSubTab === "ajouter" ? "btn-primary" : "btn-secondary"}`}>➕ Ajouter une commande</button>
        <button onClick={() => setActiveSubTab("reception")} className={`btn ${activeSubTab === "reception" ? "btn-primary" : "btn-secondary"}`}>Réception en cours</button>
        <button onClick={() => setActiveSubTab("recues")} className={`btn ${activeSubTab === "recues" ? "btn-primary" : "btn-secondary"}`}>Commandes reçues</button>
        <button onClick={() => setActiveSubTab("gestion")} className={`btn ${activeSubTab === "gestion" ? "btn-primary" : "btn-secondary"}`}>Gestion des TLC/TLP</button>
      </div>

      {/* COMMANDES A VENIR */}
      {activeSubTab === "commande" && (
        <div>
          {pendingOrders.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
              Aucune commande de lait en attente.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pendingOrders.map(o => (
                <div key={o.id} style={{ border: "1px solid var(--border-color)", padding: "16px", borderRadius: "var(--radius-md)", backgroundColor: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "var(--primary)" }}>{o.supplier || "Fournisseur Inconnu"}</h4>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "16px" }}>
                      <span><strong>Type :</strong> {o.milkType}</span>
                      <span><strong>Date :</strong> {new Date(o.scheduledDate).toLocaleString()}</span>
                      <span><strong>Quantité :</strong> {o.receivedQuantity ? `${o.receivedQuantity.toLocaleString()} L / ` : ""}{o.quantity.toLocaleString()} L</span>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedOrderId(o.id); setActiveSubTab("reception"); }} className="btn btn-success" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                    Réceptionner
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COMMANDES RECUES */}
      {activeSubTab === "recues" && (
        <div>
          {receivedOrders.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
              Aucune commande de lait reçue.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {receivedOrders.map(o => (
                <div key={o.id} style={{ border: "1px solid var(--border-color)", padding: "16px", borderRadius: "var(--radius-md)", backgroundColor: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
                      {o.supplier || "Fournisseur Inconnu"}
                      <span style={{ fontSize: "0.8rem", backgroundColor: "var(--success)", color: "white", padding: "2px 6px", borderRadius: "4px" }}>Reçue</span>
                    </h4>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "16px" }}>
                      <span><strong>Type :</strong> {o.milkType}</span>
                      <span><strong>Date :</strong> {new Date(o.scheduledDate).toLocaleString()}</span>
                      <span><strong>Quantité reçue :</strong> {o.receivedQuantity?.toLocaleString()} L</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AJOUTER UNE COMMANDE DE LAIT */}
      {activeSubTab === "ajouter" && (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", backgroundColor: "#f8fafc" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", textAlign: "center" }}>Nouvelle Commande de Lait</h3>
          <form onSubmit={handleAddOrder} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Type de Lait
              <select value={newOrderType} onChange={(e) => setNewOrderType(e.target.value as MilkType)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                <option value="bio">Bio</option>
                <option value="fcv3">FCV3</option>
                <option value="savoie">Savoie</option>
                <option value="montagne">Montagne</option>
                <option value="creme">Crème</option>
                <option value="ecreme_savoie">Écrémé Savoie</option>
                <option value="ecreme_montagne">Écrémé Montagne</option>
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Fournisseur
              <input type="text" value={newOrderSupplier} onChange={(e) => setNewOrderSupplier(e.target.value)} required placeholder="Nom du fournisseur/coopérative" style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Date de livraison prévue
              <input type="datetime-local" value={newOrderDate} onChange={(e) => setNewOrderDate(e.target.value)} required style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Quantité (L)
              <input type="number" value={newOrderQty} onChange={(e) => setNewOrderQty(e.target.value)} required min="1" style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
            </label>

            <button type="submit" className="btn btn-success" style={{ marginTop: "10px", padding: "10px", fontSize: "1rem", fontWeight: "bold" }}>✓ Valider</button>
          </form>
        </div>
      )}

      {/* RECEPTION EN COURS */}
      {activeSubTab === "reception" && (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {pendingOrders.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
              Aucune commande à réceptionner. Allez dans &quot;Ajouter une commande&quot; en premier.
            </div>
          ) : (
            <form onSubmit={handleReceiveOrder} style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", backgroundColor: "#f8fafc" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Commande de Lait
                <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                  <option value="" disabled>-- Sélectionner --</option>
                  {pendingOrders.map(o => (
                    <option key={o.id} value={o.id}>{o.supplier} - {o.milkType} - {o.receivedQuantity ? `${o.receivedQuantity}L / ` : ""}{o.quantity}L</option>
                  ))}
                </select>
              </label>

              {selectedOrderId && (
                <>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    TLC/TLP de destination
                    <select value={destTank} onChange={(e) => setDestTank(e.target.value as any)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                      {TLC_TANKS.map(t => <option key={t.key} value={t.key}>{t.name}</option>)}
                    </select>
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Date et Heure de Réception (génère le n° de lot)
                    <input type="datetime-local" value={receptionDate} onChange={(e) => setReceptionDate(e.target.value)} required style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
                  </label>

                  <button type="button" onClick={() => setShowControlPopup(true)} className="btn btn-primary" style={{ padding: "10px", fontSize: "1rem", fontWeight: "bold" }}>
                    📋 Contrôle Qualité
                  </button>

                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600, marginTop: "8px" }}>
                    Quantité reçue réelle (L)
                    <input type="number" value={realQty} onChange={(e) => setRealQty(e.target.value)} required min="1" style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", marginTop: "8px", cursor: "pointer" }}>
                    <input type="checkbox" checked={closeOrder} onChange={e => setCloseOrder(e.target.checked)} style={{ width: "16px", height: "16px" }} />
                    Clôturer la commande après cette réception
                  </label>

                  <button type="submit" className="btn btn-success" style={{ marginTop: "10px", padding: "10px", fontSize: "1rem", fontWeight: "bold" }}>
                    ✓ Valider la réception
                  </button>
                </>
              )}
            </form>
          )}

          {/* CONTROL POPUP MODAL */}
          {showControlPopup && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
              <form onSubmit={(e) => { e.preventDefault(); setShowControlPopup(false); }} style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "var(--radius-lg)", maxWidth: "500px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
                <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--primary)" }}>Contrôle Qualité Lait</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Température (°C)
                    <input type="number" step="0.1" value={controlTemp} onChange={e => setControlTemp(e.target.value)} style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }} />
                  </label>
                  
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Snap Test OK ?
                    <select value={controlSnap ? "true" : "false"} onChange={e => setControlSnap(e.target.value === "true")} style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}>
                      <option value="true">Oui</option>
                      <option value="false">Non</option>
                    </select>
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    pH
                    <input type="number" step="0.01" value={controlPh} onChange={e => setControlPh(e.target.value)} style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }} />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Acidité Dornic (°D)
                    <input type="number" step="0.1" value={controlAcidite} onChange={e => setControlAcidite(e.target.value)} style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }} />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Litrage sur BL (L)
                    <input type="number" value={controlLitrageBL} onChange={e => setControlLitrageBL(e.target.value)} style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }} />
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px", borderTop: "1px solid #ccc", paddingTop: "12px" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    MG (Matière Grasse) g/L
                    <input type="number" step="0.1" value={controlMg} onChange={e => setControlMg(e.target.value)} style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }} />
                  </label>
                  
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    MP (Matière Protéique) g/L
                    <input type="number" step="0.1" value={controlMp} onChange={e => setControlMp(e.target.value)} style={{ padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }} />
                  </label>
                </div>

                {milkOrders.find(o => o.id === selectedOrderId)?.milkType === "fcv3" && (
                  <div style={{ marginTop: "12px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>
                      MP spécifique FCV3 (g/L)
                      <input type="number" step="0.1" value={controlFcv3Mp} onChange={e => setControlFcv3Mp(e.target.value)} style={{ padding: "6px", border: "1px solid var(--primary)", borderRadius: "4px" }} />
                    </label>
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setShowControlPopup(false)} className="btn btn-secondary">Fermer</button>
                  <button type="submit" className="btn btn-success">Enregistrer les valeurs</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* GESTION DES TLC/TLP */}
      {activeSubTab === "gestion" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {TLC_TANKS.map(tank => {
            const batches = tlcBatches[tank.key as keyof typeof tlcBatches]
            const stats = getTLCStats(batches)
            const pct = Math.max(0, (stats.volume / tank.capacity) * 100)
            const typeStr = batches.length > 0 ? batches[0].milkType : "Vide"
            const currentType = batches.length > 0 ? batches[0].milkType : "bio"
            const config = milkTypeConfigs[currentType] || milkTypeConfigs["bio"]

            return (
              <div key={tank.name} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "20px 16px", backgroundColor: "#fff", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                  <strong style={{ fontSize: "1.15rem" }}>{tank.name}</strong>
                  <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: "12px", backgroundColor: "#f1f5f9", fontWeight: 700 }}>
                    {config.emoji} {typeStr}
                  </span>
                </div>
                
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "var(--radius-md)" }}>
                  <div style={{ position: "relative", width: "70px", height: "90px", borderRadius: "14px 14px 18px 18px", border: "2px solid #cbd5e1", overflow: "hidden", display: "flex", alignItems: "flex-end", backgroundColor: "#ffffff" }}>
                    <div style={{ width: "100%", height: `${Math.min(pct, 100)}%`, background: stats.volume > tank.capacity ? "linear-gradient(180deg, #fca5a5 0%, #ef4444 100%)" : config.gradient, transition: "height 0.4s ease-out", borderRadius: "0 0 6px 6px" }} />
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "0.75rem", fontWeight: 800, color: pct > 45 ? "#fff" : "var(--text-muted)", textShadow: pct > 45 ? "0 1px 2px rgba(0,0,0,0.3)" : "none" }}>
                      {pct.toFixed(0)}%
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>VOLUME TOTAL</span>
                    <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>{stats.volume.toLocaleString()} L</strong>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4, borderTop: "1px dashed #cbd5e1", paddingTop: 4 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>MP Moy. : <strong>{stats.protein.toFixed(2)}</strong> g/L</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>MG Moy. : <strong>{stats.fat.toFixed(2)}</strong> g/L</span>
                    </div>
                  </div>
                </div>

                {batches.length > 0 && (
                  <div style={{ fontSize: "0.8rem" }}>
                    <strong>Lots présents ({batches.length}):</strong>
                    <ul style={{ paddingLeft: "16px", margin: "4px 0 0 0", color: "var(--text-muted)" }}>
                      {batches.map(b => (
                        <li key={b.id}>Lot {b.lotNumber} ({b.volume}L)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
