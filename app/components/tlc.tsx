"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { TLC_TANKS, addBatch, deleteBatch, getTLCStats, MilkType, OrderState } from "../lib/orderSlice"

export default function TLC() {
  const dispatch = useDispatch()
  const { tlcBatches } = useSelector((state: RootState) => state.order)

  // Local state for the batch adding form
  const [showAddForm, setShowAddForm] = useState<{ [tankKey: string]: boolean }>({})
  const [newBatchVolume, setNewBatchVolume] = useState("10000")
  const [newBatchProtein, setNewBatchProtein] = useState("33.0")
  const [newBatchFat, setNewBatchFat] = useState("38.0")
  const [newBatchMilkType, setNewBatchMilkType] = useState<MilkType>("bio")

  // Generate batch number YYMMDDHHMM from current local time
  const generateLotNumber = () => {
    const now = new Date()
    const yy = String(now.getFullYear()).slice(-2)
    const mm = String(now.getMonth() + 1).padStart(2, "0")
    const dd = String(now.getDate()).padStart(2, "0")
    const hh = String(now.getHours()).padStart(2, "0")
    const min = String(now.getMinutes()).padStart(2, "0")
    return `${yy}${mm}${dd}${hh}${min}`
  }

  const handleAddBatch = (tankKey: keyof OrderState["tlcBatches"]) => {
    const batches = tlcBatches[tankKey]
    const activeType = batches.length > 0 ? batches[0].milkType : newBatchMilkType

    const volume = Number(newBatchVolume.trim().replace(",", ".")) || 0
    const protein = Number(newBatchProtein.trim().replace(",", ".")) || 0
    const fat = Number(newBatchFat.trim().replace(",", ".")) || 0

    if (volume <= 0 || protein <= 0 || fat <= 0) {
      alert("Veuillez saisir des valeurs positives valides.")
      return
    }

    const maxCapacity = 30000
    const currentStats = getTLCStats(batches)
    if (currentStats.volume + volume > maxCapacity) {
      alert(`Impossible d'ajouter ce lot : la capacité maximale de ${maxCapacity.toLocaleString()} L serait dépassée (actuel: ${currentStats.volume.toLocaleString()} L).`)
      return
    }

    dispatch(addBatch({
      tank: tankKey,
      batch: {
        lotNumber: generateLotNumber(),
        volume,
        protein,
        fat,
        milkType: activeType
      }
    }))

    // Reset local states
    setShowAddForm(prev => ({ ...prev, [tankKey]: false }))
    setNewBatchVolume("10000")
    setNewBatchProtein("33.0")
    setNewBatchFat("38.0")
  }

  const milkTypeConfigs = {
    bio: {
      label: "Lait Bio",
      color: "var(--success)",
      gradient: "linear-gradient(180deg, #34d399 0%, #10b981 100%)",
      shadow: "0 0 12px rgba(16, 185, 129, 0.3)",
      bgActive: "rgba(16, 185, 129, 0.12)",
      emoji: "🌱"
    },
    fcv3: {
      label: "Lait FCV3",
      color: "var(--primary)",
      gradient: "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)",
      shadow: "0 0 12px rgba(37, 99, 235, 0.3)",
      bgActive: "rgba(37, 99, 235, 0.12)",
      emoji: "🧪"
    },
    savoie: {
      label: "Lait de Savoie",
      color: "var(--warning)",
      gradient: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)",
      shadow: "0 0 12px rgba(245, 158, 11, 0.3)",
      bgActive: "rgba(245, 158, 11, 0.12)",
      emoji: "🏔️"
    },
    montagne: {
      label: "Lait de montagne",
      color: "var(--violet)",
      gradient: "linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)",
      shadow: "0 0 12px rgba(139, 92, 246, 0.3)",
      bgActive: "rgba(139, 92, 246, 0.12)",
      emoji: "⛰️"
    },
    creme: {
      label: "Crème",
      color: "var(--danger)",
      gradient: "linear-gradient(180deg, #fca5a5 0%, #ef4444 100%)",
      shadow: "0 0 12px rgba(239, 68, 68, 0.3)",
      bgActive: "rgba(239, 68, 68, 0.12)",
      emoji: "🧈"
    },
    ecreme_savoie: {
      label: "Écrémé Savoie",
      color: "var(--warning)",
      gradient: "linear-gradient(180deg, #fde68a 0%, #f59e0b 100%)",
      shadow: "0 0 12px rgba(245, 158, 11, 0.3)",
      bgActive: "rgba(245, 158, 11, 0.12)",
      emoji: "💧"
    },
    ecreme_montagne: {
      label: "Écrémé Montagne",
      color: "var(--violet)",
      gradient: "linear-gradient(180deg, #ddd6fe 0%, #8b5cf6 100%)",
      shadow: "0 0 12px rgba(139, 92, 246, 0.3)",
      bgActive: "rgba(139, 92, 246, 0.12)",
      emoji: "💧"
    }
  }

  // Calculate global totals
  let totalVolume = 0
  TLC_TANKS.forEach((tank) => {
    const key = tank.key as keyof typeof tlcBatches
    totalVolume += getTLCStats(tlcBatches[key]).volume
  })
  const totalCapacity = 135000
  const totalPct = (totalVolume / totalCapacity) * 100

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.8rem" }}>🥛</span>
          <h2 style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>Réception et Lots du Stock de Lait Cru (TLC)</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>STOCK GLOBAL</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)" }}>
              {totalVolume.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} / {totalCapacity.toLocaleString()} L
            </span>
            <span style={{ fontSize: "0.85rem", padding: "2px 8px", borderRadius: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)", fontWeight: 700 }}>
              {totalPct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Global Stock Progress Bar */}
      <div style={{ background: "#f1f5f9", borderRadius: 8, height: 10, width: "100%", overflow: "hidden", marginBottom: 32, border: "1px solid var(--border-color)" }}>
        <div style={{ background: "linear-gradient(90deg, var(--primary) 0%, var(--success) 100%)", height: "100%", width: `${totalPct}%`, transition: "width 0.4s ease-out" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        {TLC_TANKS.map((tank) => {
          const key = tank.key as keyof typeof tlcBatches
          const batches = tlcBatches[key]
          const stats = getTLCStats(batches)
          const pct = (stats.volume / tank.capacity) * 100

          // Determine the tank milk type based on active batches or form selection
          const currentType = batches.length > 0 ? batches[0].milkType : newBatchMilkType
          const config = milkTypeConfigs[currentType]

          const isOpenForm = showAddForm[key]

          return (
            <div
              key={tank.name}
              style={{
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 16px",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--shadow-sm)",
                position: "relative",
                transition: "var(--transition)",
              }}
            >
              {/* Card top border glow */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: config.gradient, borderTopLeftRadius: "var(--radius-lg)", borderTopRightRadius: "var(--radius-lg)" }} />

              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 12, alignItems: "center" }}>
                <strong style={{ fontSize: "1.15rem", color: "#0f172a" }}>{tank.name}</strong>
                <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "12px", border: `1px solid ${config.color}`, color: config.color, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {config.emoji} {config.label}
                </span>
              </div>

              {/* Graphical Cylinder & averages */}
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, backgroundColor: "var(--bg-app)", padding: 12, borderRadius: "var(--radius-md)" }}>
                {/* Cylinder */}
                <div
                  style={{
                    position: "relative",
                    width: "70px",
                    height: "90px",
                    background: "#ffffff",
                    borderRadius: "14px 14px 18px 18px",
                    border: "2px solid #cbd5e1",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "flex-end"
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${pct}%`,
                      background: config.gradient,
                      transition: "height 0.4s ease-out",
                      position: "relative",
                      borderRadius: "0 0 6px 6px"
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.4)" }} />
                  </div>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "0.75rem", fontWeight: 800, color: pct > 45 ? "white" : "var(--text-muted)", textShadow: pct > 45 ? "0 1px 2px rgba(0,0,0,0.3)" : "none" }}>
                    {pct.toFixed(0)}%
                  </div>
                </div>

                {/* stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>VOLUME TOTAL</span>
                  <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>{stats.volume.toLocaleString()} L</strong>

                  {batches.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4, borderTop: "1px dashed #cbd5e1", paddingTop: 4 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        🧪 Protéines : <strong>{stats.protein.toFixed(1)} g/L</strong>
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        🧈 Grisses : <strong>{stats.fat.toFixed(1)} g/L</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Batches List inside the TLC */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Lots de Lait Cru ({batches.length})
                </span>

                {batches.length === 0 ? (
                  <div style={{ padding: "16px 8px", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", textAlign: "center", fontStyle: "italic", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Aucun lot. Cuve vide.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "160px", overflowY: "auto", paddingRight: 4 }}>
                    {batches.map((batch) => (
                      <div
                        key={batch.id}
                        style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid var(--border-color)",
                          borderRadius: "6px",
                          padding: "8px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <strong style={{ fontSize: "0.8rem", color: "#334155" }}>Lot: {batch.lotNumber}</strong>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {batch.volume.toLocaleString()} L — Prot: <strong>{batch.protein} g/L</strong> | MG: <strong>{batch.fat}</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch(deleteBatch({ tank: key, batchId: batch.id }))}
                          style={{
                            border: "none",
                            background: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontWeight: 700,
                            padding: "4px 8px",
                            transition: "var(--transition)",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                          title="Supprimer ce lot"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Batch Trigger & Form */}
              <div>
                {!isOpenForm ? (
                  <button
                    type="button"
                    onClick={() => {
                      // If empty, set default milkType of this tank
                      if (batches.length === 0) {
                        const defaultType = key === "tlc1" ? "bio" : key === "tlc2" ? "fcv3" : key === "tlc3" ? "savoie" : key === "tankPermeat" ? "creme" : "montagne"
                        setNewBatchMilkType(defaultType)
                      }
                      setShowAddForm(prev => ({ ...prev, [key]: true }))
                    }}
                    className="btn btn-secondary"
                    style={{ width: "100%", padding: "8px 12px", fontSize: "0.8rem" }}
                  >
                    ➕ Réceptionner un Lot
                  </button>
                ) : (
                  <div style={{ backgroundColor: "#f8fafc", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "0.8rem", color: "var(--primary)" }}>Nouveau Lot à réceptionner</strong>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(prev => ({ ...prev, [key]: false }))}
                        style={{ border: "none", background: "none", cursor: "pointer", fontWeight: 700, color: "var(--text-muted)" }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* MilkType choice only enabled if tank is empty */}
                    {batches.length === 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>Type de Lait</span>
                        <select
                          value={newBatchMilkType}
                          onChange={(e) => setNewBatchMilkType(e.target.value as MilkType)}
                          style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                        >
                          <option value="bio">🌱 Bio</option>
                          <option value="fcv3">🧪 FCV3</option>
                          <option value="savoie">🏔️ Savoie</option>
                          <option value="montagne">⛰️ Montagne</option>
                        </select>
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>Volume (L)</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={newBatchVolume}
                          onChange={(e) => setNewBatchVolume(e.target.value)}
                          style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>Protéines (g/L)</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={newBatchProtein}
                            onChange={(e) => setNewBatchProtein(e.target.value)}
                            style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "4px", border: "1px solid var(--border-color)", textAlign: "center" }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>M. Grasse (g/L)</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={newBatchFat}
                            onChange={(e) => setNewBatchFat(e.target.value)}
                            style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: "4px", border: "1px solid var(--border-color)", textAlign: "center" }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddBatch(key)}
                      className="btn btn-primary"
                      style={{ width: "100%", padding: "6px 12px", fontSize: "0.75rem", marginTop: 4 }}
                    >
                      ✓ Enregistrer le Lot
                    </button>
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
