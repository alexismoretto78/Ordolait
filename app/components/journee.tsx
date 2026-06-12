"use client"

import { useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../lib/store"

export default function Journee() {
  const { commands } = useSelector((state: RootState) => state.order)
  
  // Default to today's date (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  )

  const { totalWhiteMass, referencesSummary } = useMemo(() => {
    // Filter commands that start on the selected date
    const commandsForDate = commands.filter((cmd) => {
      if (!cmd.startDate) return false
      return cmd.startDate.startsWith(selectedDate)
    })

    let totalMass = 0
    const refsMap = new Map<string, { name: string; potsQty: number; gramPerPot: number }>()

    commandsForDate.forEach((cmd) => {
      totalMass += cmd.whiteMassKg

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

    return {
      totalWhiteMass: totalMass,
      referencesSummary: Array.from(refsMap.values()),
    }
  }, [commands, selectedDate])

  return (
    <div className="module-card">
      <div className="module-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2>📅 Résumé de la Journée</h2>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
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
          {/* Masse Blanche Totale */}
          <div style={{
            background: "var(--primary-light)",
            padding: "20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--primary-border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <h3 style={{ margin: 0, color: "var(--primary)", fontSize: "1.2rem" }}>Masse Blanche à Produire</h3>
            <p style={{ margin: "10px 0 0 0", fontSize: "2.5rem", fontWeight: 800, color: "var(--primary-dark)" }}>
              {totalWhiteMass.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>kg</span>
            </p>
          </div>

          {/* Références Conditionnées */}
          <div style={{
            background: "var(--bg-card)",
            padding: "20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
          }}>
            <h3 style={{ margin: "0 0 15px 0", color: "var(--text-main)", fontSize: "1.2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
              Références à Conditionner
            </h3>
            
            {referencesSummary.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                Aucune référence prévue pour cette date.
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
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
