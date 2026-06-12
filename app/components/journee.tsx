"use client"

import { useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../lib/store"

const MILK_LABELS: Record<string, string> = {
  bio: "Bio",
  fcv3: "FCV3",
  savoie: "Savoie",
  montagne: "Montagne",
  creme: "Crème",
  ecreme_savoie: "Écrémé Savoie",
  ecreme_montagne: "Écrémé Montagne"
}

export default function Journee() {
  const { commands, simulationResults, productionStartTime } = useSelector((state: RootState) => state.order)
  
  // Default to today's date (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  )

  const { masseBlancheParLait, referencesSummary } = useMemo(() => {
    const dayStart = new Date(`${selectedDate}T00:00:00`).getTime()
    const dayEnd = new Date(`${selectedDate}T23:59:59.999`).getTime()

    const massMap = new Map<string, number>()
    const refsMap = new Map<string, { name: string; potsQty: number; gramPerPot: number }>()

    const processCommandMass = (cmd: any, proportion: number) => {
      cmd.references.forEach((r: any) => {
        const name = r.name.toLowerCase()
        let multiplier = 1
        if (name.includes("baiko") || name.includes("mdd") || name.includes("val de praz") || name.includes("vdp")) {
          multiplier = 1.05
        }
        const mass = (r.potsQty * r.gramPerPot) / 1000 * multiplier
        
        let milk = r.milkType || cmd.milkType || "bio"
        if (name.includes("skyr")) {
          milk = cmd.skyrMilkType || "fcv3"
        }
        
        massMap.set(milk, (massMap.get(milk) || 0) + mass * proportion)
      })
    }

    if (simulationResults) {
      let simStartMs = Date.now()
      if (productionStartTime) {
        const t = new Date(productionStartTime).getTime()
        if (!isNaN(t)) simStartMs = t
      }

      Object.values(simulationResults.commandsResults).forEach((cmdSim) => {
        const cmd = commands.find(c => c.id === cmdSim.id)
        if (!cmd) return

        // 1. Masse Blanche (production en amont : transfer -> maturationEnd)
        const prepStart = simStartMs + cmdSim.transferStart * 60000
        const prepEnd = simStartMs + cmdSim.maturationEnd * 60000
        
        if (prepStart < dayEnd && prepEnd > dayStart) {
          const overlapStart = Math.max(prepStart, dayStart)
          const overlapEnd = Math.min(prepEnd, dayEnd)
          const duration = prepEnd - prepStart
          const proportion = duration > 0 ? (overlapEnd - overlapStart) / duration : 1
          
          processCommandMass(cmd, proportion)
        }

        // 2. Conditionnement (packaging : ref.start -> ref.end)
        if (cmdSim.referencesResults) {
          cmdSim.referencesResults.forEach((refSim) => {
            const refAbsStart = simStartMs + refSim.start * 60000
            const refAbsEnd = simStartMs + refSim.end * 60000

            if (refAbsStart < dayEnd && refAbsEnd > dayStart) {
              const overlapStart = Math.max(refAbsStart, dayStart)
              const overlapEnd = Math.min(refAbsEnd, dayEnd)
              const duration = refAbsEnd - refAbsStart
              const proportion = duration > 0 ? (overlapEnd - overlapStart) / duration : 1

              const refOriginal = cmd.references.find(r => r.id === refSim.refId)
              if (refOriginal) {
                const dailyPots = refOriginal.potsQty * proportion
                
                if (refsMap.has(refSim.refId)) {
                  const existing = refsMap.get(refSim.refId)!
                  refsMap.set(refSim.refId, {
                    ...existing,
                    potsQty: existing.potsQty + dailyPots
                  })
                } else {
                  refsMap.set(refSim.refId, {
                    name: refOriginal.name,
                    potsQty: dailyPots,
                    gramPerPot: refOriginal.gramPerPot
                  })
                }
              }
            }
          })
        }
      })
    } else {
      // Fallback si pas de simulation : on utilise la date de début de la commande
      const commandsForDate = commands.filter((cmd) => {
        if (!cmd.startDate) return false
        return cmd.startDate.startsWith(selectedDate)
      })

      commandsForDate.forEach((cmd) => {
        processCommandMass(cmd, 1) // 100% sur cette journée

        cmd.references.forEach((ref) => {
          if (refsMap.has(ref.id)) {
            const existing = refsMap.get(ref.id)!
            refsMap.set(ref.id, {
              ...existing,
              potsQty: existing.potsQty + ref.potsQty,
            })
          } else {
            refsMap.set(ref.id, {
              name: ref.name,
              potsQty: ref.potsQty,
              gramPerPot: ref.gramPerPot,
            })
          }
        })
      })
    }

    const massSummary = Array.from(massMap.entries())
      .map(([milkType, mass]) => ({ milkType, mass: Math.round(mass) }))
      .filter(item => item.mass > 0)
      .sort((a, b) => b.mass - a.mass)

    return {
      masseBlancheParLait: massSummary,
      referencesSummary: Array.from(refsMap.values()).map(r => ({ ...r, potsQty: Math.round(r.potsQty) })).sort((a, b) => b.potsQty - a.potsQty),
    }
  }, [commands, simulationResults, productionStartTime, selectedDate])

  const totalGlobalMass = masseBlancheParLait.reduce((sum, item) => sum + item.mass, 0)

  return (
    <div className="module-card">
      <div className="module-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2>📅 Résumé de la Journée</h2>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {!simulationResults && (
           <div style={{ padding: "10px", backgroundColor: "var(--warning)", color: "white", borderRadius: "8px", marginBottom: "20px", fontWeight: "bold" }}>
             {"⚠️ Lancez la simulation dans l'onglet \"Simulation & Gantt\" pour avoir un résumé précis de la journée incluant les temps de production."}
           </div>
        )}

        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <label htmlFor="date-select" style={{ fontWeight: 600, color: "var(--text-main)" }}>Sélectionner une date :</label>
          <input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              outline: "none",
              fontFamily: "inherit",
              fontSize: "1rem"
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {/* Masse Blanche Totale et Par Lait */}
          <div style={{
            background: "var(--primary-light)",
            padding: "20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--primary-border)",
            display: "flex",
            flexDirection: "column",
          }}>
            <h3 style={{ margin: "0 0 15px 0", color: "var(--primary)", fontSize: "1.2rem", textAlign: "center" }}>Masse Blanche en Préparation (TLC➔Cuves)</h3>
            
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: 800, color: "var(--primary-dark)" }}>
                {totalGlobalMass.toLocaleString("fr-FR")} <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>kg au total</span>
              </p>
            </div>

            {masseBlancheParLait.length === 0 ? (
              <p style={{ color: "var(--primary)", fontStyle: "italic", textAlign: "center" }}>
                Aucune préparation prévue.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {masseBlancheParLait.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    background: "rgba(255, 255, 255, 0.6)",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.05)"
                  }}>
                    <span style={{ fontWeight: 700, color: "var(--primary-dark)" }}>Lait {MILK_LABELS[item.milkType] || item.milkType}</span>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)" }}>{item.mass.toLocaleString("fr-FR")} kg</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Références Conditionnées */}
          <div style={{
            background: "var(--bg-card)",
            padding: "20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
          }}>
            <h3 style={{ margin: "0 0 15px 0", color: "var(--text-main)", fontSize: "1.2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
              Références Conditionnées sur la journée
            </h3>
            
            {referencesSummary.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                Aucune référence prévue pour cette date.
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" }}>
                {referencesSummary.map((ref, idx) => (
                  <li key={idx} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--bg-main)",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)"
                  }}>
                    <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "1.1rem" }}>{ref.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{ref.gramPerPot}g/pot</span>
                      <span style={{ 
                        background: "var(--primary)", 
                        color: "white", 
                        padding: "4px 10px", 
                        borderRadius: "20px",
                        fontWeight: 700,
                        fontSize: "0.95rem"
                      }}>
                        {ref.potsQty.toLocaleString("fr-FR")} pots
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
