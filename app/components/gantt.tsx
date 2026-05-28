"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { startSimulation, updateSimulationProgress, completeSimulation } from "../lib/orderSlice"

export default function Gantt() {
  const dispatch = useDispatch()
  const {
    commands,
    isSimulating,
    simulationDone,
    simulationProgress,
    simulationStepText,
    simulationResults
  } = useSelector((state: RootState) => state.order)

  const totalReceivedVolume = commands.reduce((t, c) => t + c.milkReceivedVolume, 0)
  const totalDuration = simulationResults?.totalDurationMinutes || 0
  const tasks = simulationResults?.ganttTasks || []

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleStartSimulation = () => {
    if (totalReceivedVolume <= 0) return

    dispatch(startSimulation())

    const steps = [
      { p: 10, text: "Analyse et ordonnancement optimal des commandes..." },
      { p: 25, text: "Simulation du transfert séquentiel TLC → TLS..." },
      { p: 45, text: "Osmose inverse et détection de capacité en cuves..." },
      { p: 65, text: "Pasteurisation continue avec recharge dynamique..." },
      { p: 85, text: "Maturation en cuves et allocation aux emballeuses..." },
      { p: 95, text: "Calcul des vitesses réelles de conditionnement (ATIA/GRUN)..." },
      { p: 100, text: "Optimisation de production terminée avec succès !" },
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        dispatch(
          updateSimulationProgress({
            progress: steps[currentStep].p,
            stepText: steps[currentStep].text,
          })
        )
        currentStep++
      } else {
        clearInterval(interval)
        dispatch(completeSimulation())
      }
    }, 250)
  }

  return (
    <div className="card">
      <h2>6. Planning Gantt Chronologique Global</h2>

      {/* Control bar */}
      <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleStartSimulation}
            disabled={isSimulating || totalReceivedVolume <= 0}
            className="btn btn-primary"
            style={{ minWidth: 220 }}
          >
            {isSimulating ? "Simulation en cours..." : "Lancer la simulation"}
          </button>
          
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Cliquez pour lancer le calcul d&apos;ordonnancement optimal de toutes vos commandes.
          </span>
        </div>

        {totalReceivedVolume <= 0 && (
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", fontWeight: 600, fontStyle: "italic", marginTop: 4 }}>
            ⚠️ Configurez au moins une commande avec un nombre de pots supérieur à 0 pour lancer la simulation.
          </p>
        )}
      </div>

      {/* Progress animation */}
      {isSimulating && (
        <div style={{ marginBottom: 24, padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div className="simulation-step-status">{simulationStepText}</div>
          <div className="simulation-progress-container" style={{ margin: "8px 0 0 0" }}>
            <div className="simulation-progress-bar" style={{ width: `${simulationProgress}%` }}></div>
          </div>
        </div>
      )}

      {!simulationDone && !isSimulating ? (
        <p className="gantt-empty">
          Aucune simulation active. Cliquez sur le bouton &quot;Lancer la simulation&quot; ci-dessus pour générer le planning de production multi-commandes.
        </p>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <div className="gantt-scroll-container">
              <div className="gantt-scroll-content">
                <div className="gantt-header-row">
                  <div style={{ minWidth: 220 }}>Étape et Commande</div>
                  <div style={{ flex: 1.5 }}>Durée</div>
                  <div style={{ flex: 5 }}>Timeline</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {tasks.map((task) => (
                    <div key={task.key} className="gantt-row">
                      <div className="gantt-row-label" style={{ minWidth: 220, fontSize: "0.85rem", fontWeight: 600 }}>
                        {task.label}
                      </div>
                      <div className="gantt-row-duration" style={{ fontSize: "0.8rem" }}>
                        {formatTime(task.durationMinutes)}
                      </div>
                      <div className="gantt-timeline-container">
                        <div className="gantt-bar-bg">
                          <div
                            className="gantt-bar-fill"
                            style={{
                              left: `${(task.startMinute / totalDuration) * 100}%`,
                              width: `${(task.durationMinutes / totalDuration) * 100}%`,
                              backgroundColor: task.color,
                              fontSize: "0.7rem",
                            }}
                          >
                            +{task.startMinute.toFixed(0)}m
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                <strong>Lavage des Cuves CF</strong> : Nettoyage automatique obligatoire de <strong>30 minutes</strong> après chaque conditionnement (visible en gris).
              </li>
              <li>
                <strong>Conditionnement</strong> : <strong>3 500 pots/h</strong> sur ATIA, <strong>10 000 pots/h</strong> sur Grunwald (ou <strong>13 500 pots/h</strong> combinés).
              </li>
              <li>
                <strong>Overlap Cuves CF</strong> : La pasteurisation de la commande suivante commence dès qu&apos;une cuve se libère et offre une capacité suffisante.
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
