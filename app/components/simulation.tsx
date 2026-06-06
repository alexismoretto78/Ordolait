"use client"

import { useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { TLC_TANKS } from "../lib/orderSlice"

export default function Simulation() {
  const {
    productionStartTime,
    simulationResults,
    tlcVolumes,
    tlcMilkTypes
  } = useSelector((state: RootState) => state.order)

  const totalDurationMinutes = simulationResults?.totalDurationMinutes || 0

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  // Format Date and Time in French style (DD/MM/YYYY à HH:MM)
  const formatDateTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${day}/${month}/${year} à ${hours}:${minutes}`
  }

  // Calculate start & end dates based on simulated start time
  const startDate = productionStartTime ? new Date(productionStartTime) : new Date()
  const endDate = new Date(startDate.getTime() + totalDurationMinutes * 60 * 1000)

  const getCalendarTime = (minutes: number) => {
    return formatDateTime(new Date(startDate.getTime() + minutes * 60 * 1000))
  }

  // Style configurations per Milk Type
  const milkTypeColors = {
    bio: {
      label: "🌱 Bio",
      gradient: "linear-gradient(180deg, #34d399 0%, #10b981 100%)",
      color: "var(--success)"
    },
    fcv3: {
      label: "🧪 FCV3",
      gradient: "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)",
      color: "var(--primary)"
    },
    savoie: {
      label: "🏔️ Savoie",
      gradient: "linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)",
      color: "var(--warning)"
    },
    montagne: {
      label: "⛰️ Montagne",
      gradient: "linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)",
      color: "var(--violet)"
    },
    creme: {
      label: "🧈 Crème",
      gradient: "linear-gradient(180deg, #fca5a5 0%, #ef4444 100%)",
      color: "var(--danger)"
    },
    ecreme_savoie: {
      label: "💧 Écrémé Savoie",
      gradient: "linear-gradient(180deg, #fde68a 0%, #f59e0b 100%)",
      color: "var(--warning)"
    },
    ecreme_montagne: {
      label: "💧 Écrémé Montagne",
      gradient: "linear-gradient(180deg, #ddd6fe 0%, #8b5cf6 100%)",
      color: "var(--violet)"
    }
  }

  return (
    <div className="card">
      <h2>5.1. Rapport de Simulation de Production Globale</h2>
      <div className="form-grid">
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Ce rapport affiche la synthèse des temps métiers multi-commandes optimisés et l&apos;impact cumulatif sur les réservoirs de lait cru (TLC).
        </p>

        {(!simulationResults || Object.keys(simulationResults.commandsResults).length === 0) ? (
          <div style={{ padding: "30px 20px", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px dashed var(--border-color)", marginTop: 8 }}>
            <span style={{ fontSize: "2rem" }}>📊</span>
            <h4 style={{ margin: "12px 0 6px 0", color: "#334155" }}>Aucun rapport disponible</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "400px", margin: "0 auto" }}>
              Veuillez ajouter des commandes contenant au moins une référence produit pour générer le rapport.
            </p>
          </div>
        ) : (
          <div className="sim-results-container">
            
            {/* Command-by-command details & timelines */}
            <div className="sim-summary-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="sim-summary-title">
                ⏱️ Synthèse Temporelle par Commande
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {Object.values(simulationResults.commandsResults).map((cmdRes, idx) => {
                  return (
                    <div 
                      key={cmdRes.id} 
                      style={{ 
                        backgroundColor: "white", 
                        border: "1px solid var(--border-color)", 
                        borderRadius: "var(--radius-md)", 
                        padding: "14px",
                        boxShadow: "var(--shadow-sm)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--border-color)", paddingBottom: 6, marginBottom: 10 }}>
                        <strong style={{ color: "var(--primary)", fontSize: "0.95rem" }}>{cmdRes.name}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                          Durée : {formatTime(cmdRes.totalDuration - cmdRes.transferStart)}
                        </span>
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", fontSize: "0.8rem" }}>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>Début transfert :</span><br />
                          <strong>{getCalendarTime(cmdRes.transferStart)}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>Fin pasteurisation :</span><br />
                          <strong>{getCalendarTime(cmdRes.pastoEnd)}</strong>
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <span style={{ color: "var(--text-muted)" }}>Maturation (début cond.) :</span><br />
                          <strong>{getCalendarTime(cmdRes.maturationEnd)}</strong>
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <span style={{ color: "var(--success-hover)" }}>Conditionnement terminé :</span><br />
                          <strong style={{ color: "var(--success-hover)" }}>{getCalendarTime(cmdRes.packagingEnd)}</strong>
                        </div>
                        
                        {cmdRes.firstTankName && (
                          <>
                            <div style={{ marginTop: 4 }}>
                              <span style={{ color: "var(--text-muted)" }}>Fin maturation 1ère cuve ({cmdRes.firstTankName}) :</span><br />
                              <strong>{cmdRes.firstTankMaturationEnd ? getCalendarTime(cmdRes.firstTankMaturationEnd) : "-"}</strong>
                            </div>
                            <div style={{ marginTop: 4 }}>
                              <span style={{ color: "var(--text-muted)" }}>Fin 1ère cuve ({cmdRes.firstTankName}) :</span><br />
                              <strong>{cmdRes.firstTankEmptyEnd ? getCalendarTime(cmdRes.firstTankEmptyEnd) : "-"}</strong>
                            </div>
                            <div style={{ marginTop: 4 }}>
                              <span style={{ color: "var(--text-muted)" }}>Début lavage ({cmdRes.firstTankName}) :</span><br />
                              <strong>{cmdRes.firstTankEmptyEnd ? getCalendarTime(cmdRes.firstTankEmptyEnd) : "-"}</strong>
                            </div>
                          </>
                        )}
                      </div>

                      {cmdRes.referencesResults && cmdRes.referencesResults.length > 0 && (
                        <div style={{ marginTop: 12, borderTop: "1px dashed var(--border-color)", paddingTop: 10 }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                            📦 Détail Conditionnement par Référence :
                          </span>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {cmdRes.referencesResults.map((refRes) => (
                              <div 
                                key={refRes.refId} 
                                style={{ 
                                  backgroundColor: "#f8fafc", 
                                  padding: "8px 12px", 
                                  borderRadius: "6px", 
                                  border: "1px solid var(--border-color)",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 4
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <strong style={{ fontSize: "0.8rem", color: "var(--primary)" }}>{refRes.name}</strong>
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                    Durée : {formatTime(refRes.end - refRes.start)}
                                  </span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: "0.75rem" }}>
                                  <div>
                                    <span style={{ color: "var(--text-muted)" }}>Début :</span><br />
                                    <strong>{getCalendarTime(refRes.start)}</strong>
                                  </div>
                                  <div>
                                    <span style={{ color: "var(--text-muted)" }}>Fin :</span><br />
                                    <strong>{getCalendarTime(refRes.end)}</strong>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Overall Calendar synthesis */}
              <div className="sim-time-box" style={{ marginTop: 10 }}>
                <div className="sim-time-row">
                  <span style={{ fontWeight: 600, color: "#1e3a8a" }}>Début de production global :</span>
                  <strong style={{ color: "#1e3a8a" }}>{formatDateTime(startDate)}</strong>
                </div>
                <div className="sim-time-row" style={{ borderTop: "1px dashed var(--primary-border)", paddingTop: 8 }}>
                  <span style={{ fontWeight: 600, color: "var(--success-hover)" }}>Fin de production global :</span>
                  <strong style={{ color: "var(--success-hover)" }}>{formatDateTime(endDate)}</strong>
                </div>
                <div className="sim-time-row" style={{ borderTop: "1px dashed var(--primary-border)", paddingTop: 8 }}>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>Durée totale du process :</span>
                  <strong style={{ color: "#1e293b" }}>{formatTime(totalDurationMinutes)}</strong>
                </div>
              </div>
            </div>

            {/* TLC remaining volumes cylinders */}
            <div className="sim-summary-card">
              <div className="sim-summary-title">
                🥛 Impact Cumulé sur les Réservoirs TLC
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>
                Nouveaux volumes restants dans les cuves de réception après prélèvement de toutes les commandes :
              </p>

              <div className="tlc-tanks-visual-grid">
                {TLC_TANKS.map((tank) => {
                  const key = tank.name.toLowerCase() as keyof typeof tlcVolumes
                  const initial = tlcVolumes[key]
                  const remainingBatches = simulationResults.tlcRemainingBatches?.[key] || []
                  const remaining = remainingBatches.reduce((sum, b) => sum + b.volume, 0)
                  const delta = initial - remaining
                  const pct = Math.max(0, (remaining / tank.capacity) * 100)
                  const currentType = tlcMilkTypes[key] || "bio"
                  const config = milkTypeColors[currentType]

                  return (
                    <div key={tank.name} className="tlc-tank-card" style={{ borderColor: config.color }}>
                      <span className="tlc-tank-name" style={{ fontWeight: 700 }}>{tank.name}</span>
                      
                      {/* Milk Type Tag */}
                      <span style={{ fontSize: "0.7rem", color: config.color, fontWeight: 700, background: "rgba(255,255,255,0.7)", padding: "2px 6px", borderRadius: "8px", border: `1px solid ${config.color}`, marginBottom: 8, whiteSpace: "nowrap" }}>
                        {config.label}
                      </span>

                      {/* Visual Cylinder */}
                      <div className="tlc-tank-cylinder" title={`Remplissage : ${pct.toFixed(0)}%`} style={{ border: `2px solid #cbd5e1`, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
                        <div 
                          className="tlc-tank-fluid" 
                          style={{ 
                            height: `${pct}%`, 
                            background: config.gradient,
                            width: "100%",
                            position: "relative",
                            transition: "height 0.5s ease-out" 
                          }}
                        >
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.3)" }} />
                        </div>
                      </div>

                      {/* Numbers */}
                      <span className="tlc-tank-volume-text" style={{ fontWeight: 700 }}>
                        {remaining.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L
                      </span>
                      
                      {delta > 0 ? (
                        <span className="tlc-tank-volume-delta" style={{ color: "var(--danger)", fontSize: "0.75rem", fontWeight: 600 }}>
                          -{delta.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontStyle: "italic" }}>
                          Inutilisé
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
