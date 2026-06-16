"use client"

import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { RootState } from "../lib/store"
import { toggleNeeds48hWash, toggleNeedsC3Wash, setProductionStartTime } from "../lib/orderSlice"
import TLC from "./tlc"

export default function Gantt() {
  const [showTLCPopup, setShowTLCPopup] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const dispatch = useDispatch()
  const {
    commands,
    simulationResults,
    needs48hWash,
    needsC3Wash,
    tlcBatches,
    productionStartTime
  } = useSelector((state: RootState) => state.order)

  const totalReceivedVolume = commands.reduce((t, c) => t + c.milkReceivedVolume, 0)

  const milkShortages = simulationResults?.milkShortages || {}
  const isMilkShortage = Object.keys(milkShortages).length > 0

  const formatMilkType = (str: string) => {
    const map: Record<string, string> = { bio: "Bio", fcv3: "FCV3", savoie: "Savoie", montagne: "Montagne", creme: "Crème", ecreme_savoie: "Écrémé Savoie", ecreme_montagne: "Écrémé Montagne" }
    return str.split(" / ").map(s => map[s] || s).join(" ou ")
  }

  const totalDuration = simulationResults?.totalDurationMinutes || 0
  const tasks = simulationResults?.ganttTasks || []

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getAbsoluteTime = (minutes: number, showDate: boolean = false) => {
    let baseTime = productionStartTime ? new Date(productionStartTime) : new Date();
    
    const d = new Date(baseTime);
    d.setMinutes(d.getMinutes() + minutes);
    
    if (showDate) {
      return d.toLocaleString("fr-FR", { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="card">
      <h2>6. Planning Gantt Chronologique (Dynamique)</h2>

      {/* Control bar */}
      <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {isMilkShortage && (
            <div style={{ backgroundColor: "var(--danger)", color: "white", padding: "16px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: 12, width: "100%", boxShadow: "var(--shadow-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>⚠️ Quantité de lait insuffisante.</span>
                <button
                  type="button"
                  onClick={() => setShowTLCPopup(true)}
                  style={{ backgroundColor: "white", color: "var(--danger)", padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", transition: "transform 0.1s" }}
                  onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  Compléter le stock (TLC)
                </button>
              </div>
              <div style={{ backgroundColor: "rgba(0, 0, 0, 0.15)", borderRadius: "8px", padding: "12px" }}>
                <span style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.95rem" }}>Détail des manquants estimés pour la production :</span>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.95rem", display: "flex", flexDirection: "column", gap: 4 }}>
                  {Object.entries(milkShortages).map(([type, amount]) => (
                    <li key={type}>
                      <strong>Lait {formatMilkType(type)} : </strong> {Math.round(amount).toLocaleString("fr-FR")} Litres
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 8, padding: "12px", backgroundColor: "#f1f5f9", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={needs48hWash}
              onChange={() => dispatch(toggleNeeds48hWash())}
            />
            🧼 Simuler lavages 48h (C5, ATIA, Grunwald)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={needsC3Wash}
              onChange={() => dispatch(toggleNeedsC3Wash())}
            />
            🌙 Simuler lavage de nuit 24h (C3 - Poudrage/Pasto)
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", fontWeight: 600, borderLeft: "1px solid var(--border-color)", paddingLeft: 16 }}>
            <span>🕒 Début prod. :</span>
            <input 
              type="datetime-local" 
              value={productionStartTime || ""} 
              onChange={(e) => dispatch(setProductionStartTime(e.target.value))} 
              style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        {totalReceivedVolume <= 0 && (
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", fontWeight: 600, fontStyle: "italic", marginTop: 4 }}>
            ⚠️ Configurez au moins une commande avec un nombre de pots supérieur à 0 pour voir le planning.
          </p>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="gantt-empty">
          Aucun planning à afficher. Ajoutez une commande pour générer le Gantt automatiquement.
        </p>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", overflowX: "auto", border: "1px solid var(--border-color)", borderRadius: 8, backgroundColor: "white", maxHeight: "75vh" }}>

                {/* Timeline Axis (Y-axis) */}
                <div style={{ position: "sticky", left: 0, zIndex: 10, backgroundColor: "#f8fafc", width: 80, flexShrink: 0, borderRight: "2px solid var(--border-color)", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 60, borderBottom: "1px solid var(--border-color)", position: "sticky", top: 0, backgroundColor: "#f8fafc", zIndex: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-muted)", textAlign: "center" }}>
                    Date & Heure
                  </div>
                  <div style={{ position: "relative", height: `${Math.max(totalDuration * 2, 600)}px` }}>
                    {Array.from({ length: Math.ceil(totalDuration / 60) + 1 }).map((_, i) => (
                      <div key={i} style={{ position: "absolute", top: `${i * 60 * 2}px`, width: "100%", borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, transform: "translateY(-50%)", padding: "0 4px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>{getAbsoluteTime(i * 60, true).split(" ")[0]}</span>
                        <span>{getAbsoluteTime(i * 60, false)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks Columns */}
                <div style={{ display: "flex", flexGrow: 1 }}>
                  {tasks.map((task) => {
                    let lanes: any[][] = [];
                    if (task.segments) {
                      const sorted = [...task.segments].sort((a, b) => a.startMinute - b.startMinute);
                      sorted.forEach(seg => {
                        let placed = false;
                        for (let i = 0; i < lanes.length; i++) {
                          const lane = lanes[i];
                          const lastSeg = lane[lane.length - 1];
                          if (lastSeg.startMinute + lastSeg.durationMinutes <= seg.startMinute) {
                            lane.push(seg);
                            placed = true;
                            break;
                          }
                        }
                        if (!placed) {
                          lanes.push([seg]);
                        }
                      });
                    } else {
                      lanes.push([task]);
                    }

                    return (
                      <div key={task.key} style={{ flex: "1 1 150px", minWidth: 150, borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column" }}>
                        <div style={{ height: 60, padding: 8, fontWeight: 600, fontSize: "0.85rem", textAlign: "center", borderBottom: "1px solid var(--border-color)", position: "sticky", top: 0, backgroundColor: "white", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {task.label}
                        </div>
                        <div style={{ position: "relative", height: `${Math.max(totalDuration * 2, 600)}px`, backgroundColor: "rgba(0,0,0,0.015)" }}>
                          {lanes.map((lane, laneIdx) =>
                            lane.map((seg: any, sIdx: number) => {
                              const displayText = seg.shortLabel || (seg.label ? seg.label.split("Lavage ")[1] || seg.label : "");
                              return (
                                <div
                                  key={`${laneIdx}-${sIdx}`}
                                  style={{
                                    position: "absolute",
                                    top: `${seg.startMinute * 2}px`,
                                    height: `${seg.durationMinutes * 2}px`,
                                    left: `${(laneIdx / lanes.length) * 100}%`,
                                    width: `${(100 / lanes.length)}%`,
                                    backgroundColor: seg.color || task.color,
                                    fontSize: "0.75rem",
                                    border: "1px solid rgba(0,0,0,0.15)",
                                    borderRadius: 4,
                                    padding: 4,
                                    overflow: "hidden",
                                    color: "#0f172a",
                                    fontWeight: 500,
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                  }}
                                  title={`${seg.label || task.label}\nDe ${getAbsoluteTime(seg.startMinute, true)} à ${getAbsoluteTime(seg.startMinute + seg.durationMinutes, true)}\nDurée: ${formatTime(seg.durationMinutes)}\n${seg.details || task.details || ""}`.trim()}
                                >
                                  {displayText}
                                </div>
                              );
                            })
                          )}
                          {/* Horizontal guide lines */}
                          {Array.from({ length: Math.ceil(totalDuration / 60) + 1 }).map((_, i) => (
                            <div key={i} style={{ position: "absolute", top: `${i * 60 * 2}px`, width: "100%", borderTop: "1px dashed rgba(0,0,0,0.1)", pointerEvents: "none" }} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              <div className="gantt-total">
                <span>Durée totale optimisée du cycle de production</span>
                <strong>{formatTime(totalDuration)}</strong>
              </div>
            </div>

            <div className="gantt-notes">
              <p className="gantt-notes-title">
                💡 Paramètres métiers et règles de simulation appliqués :
              </p>
              <ul style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                <li>
                  <strong>TLC ➔ TLS</strong> : Transfert de <strong>20 min pour 5 200 L</strong> de lait cru.
                </li>
                <li>
                  <strong>Osmose Inverse</strong> : Durée de <strong>1h30 (90 min) pour 5 200 L</strong> à FCV 1,28 (s&apos;ajuste proportionnellement selon le FCV réel).
                </li>
                <li>
                  <strong>Poudrage</strong> : Durée de <strong>25 min pour 4 000 L</strong>.
                </li>
                <li>
                  <strong>Pasteurisation</strong> : Vitesse de <strong>5 000 L/heure</strong>.
                </li>
                <li>
                  <strong>Maturation CF</strong> : Durée fixe de <strong>6 heures</strong>.
                </li>
                <li>
                  <strong>Lavage des Cuves CF</strong> : Nettoyage déclenché automatiquement <strong>dès que la cuve est entièrement vidée (volume à 0)</strong>. Durée de <strong>20 minutes</strong> (visible en gris, +90 min de lavage ligne pour la CF20).
                </li>
                <li>
                  <strong>Conditionnement</strong> : <strong>3 500 pots/h</strong> sur ATIA, <strong>10 000 pots/h</strong> sur Grunwald (ou <strong>13 500 pots/h</strong> combinés).
                </li>
                <li>
                  <strong>Lavages Optimisés</strong> : Les durées et fréquences de lavage des équipements (TLS, TLC, Osmoseur, Pasto) sont intégrées dynamiquement pour éviter les blocages de flux.
                </li>
              </ul>
            </div>
          </>
      )}

          {showTLCPopup && mounted && createPortal(
            <div style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "#f8fafc",
              zIndex: 999999,
              overflowY: "auto",
            }}>
              <div style={{
                width: "100%",
                minHeight: "100vh",
                padding: "24px 40px",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: "2px solid var(--border-color)", paddingBottom: 16 }}>
                  <div>
                    <h2 style={{ margin: 0, color: "var(--danger)", fontSize: "1.8rem" }}>⚠️ Lait Insuffisant : Renseigner les futures livraisons</h2>
                    <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      Ajoutez vos livraisons futures dans les cuves pour combler le manque de lait. La simulation prendra en compte l&apos;heure d&apos;arrivée du camion pour la production.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTLCPopup(false)}
                    style={{ border: "none", background: "var(--danger)", color: "white", padding: "10px 24px", borderRadius: 8, fontSize: "1.1rem", cursor: "pointer", fontWeight: "bold", boxShadow: "var(--shadow-sm)" }}
                  >
                    ✕ Fermer et retourner au Gantt
                  </button>
                </div>
                <TLC />
              </div>
            </div>,
            document.body
          )}
        </div>
      )
}
