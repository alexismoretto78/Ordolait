"use client"

import React, { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../lib/store"

function getTheoTime(startMin: number, prodStart: string) {
  if (isNaN(startMin) || startMin === 999999) return "--:--"
  const d = prodStart ? new Date(prodStart) : new Date()
  d.setMinutes(d.getMinutes() + startMin)
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

export default function Ordo() {
  const { commands, completedCommands, simulationResults, productionStartTime } = useSelector((state: RootState) => state.order)
  const [machineFilter, setMachineFilter] = useState<"ALL" | "ATIA" | "GRUNWALD">("ALL")

  const allCommands = [...completedCommands, ...commands]
  
  // Flatten references into a single list
  const rows: any[] = []
  
  allCommands.forEach(cmd => {
    const simRes = simulationResults?.commandsResults[cmd.id]
    if (simRes && simRes.referencesResults) {
      simRes.referencesResults.forEach(refRes => {
        const dest = cmd.refDestinations[refRes.refId] || "grunwald"
        let machineStr = dest.toUpperCase()
        if (dest === "both") machineStr = "ATIA + GRUNWALD"
        
        rows.push({
          commandName: cmd.name,
          refName: refRes.name,
          machine: machineStr,
          startMin: refRes.start,
          endMin: isNaN(refRes.end) ? 0 : refRes.end,
          duration: isNaN(refRes.end) || isNaN(refRes.start) || refRes.start === 999999 ? 0 : Math.round(refRes.end - refRes.start),
        })
      })
    }
  })
  
  // Sort rows by start time
  rows.sort((a, b) => a.startMin - b.startMin)

  const filteredRows = rows.filter(r => machineFilter === "ALL" || r.machine.includes(machineFilter))

  return (
    <div className="card" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
        <h2 style={{ margin: 0, color: "var(--primary)" }}>Ordonnancement (Soutirage)</h2>
        <div style={{ display: "flex", gap: "8px", background: "var(--bg-app)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <button 
            onClick={() => setMachineFilter("ALL")}
            style={{ padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600, background: machineFilter === "ALL" ? "var(--primary)" : "transparent", color: machineFilter === "ALL" ? "#fff" : "var(--text-muted)", transition: "all 0.2s" }}
          >
            Toutes
          </button>
          <button 
            onClick={() => setMachineFilter("ATIA")}
            style={{ padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600, background: machineFilter === "ATIA" ? "var(--primary)" : "transparent", color: machineFilter === "ATIA" ? "#fff" : "var(--text-muted)", transition: "all 0.2s" }}
          >
            ATIA
          </button>
          <button 
            onClick={() => setMachineFilter("GRUNWALD")}
            style={{ padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600, background: machineFilter === "GRUNWALD" ? "var(--primary)" : "transparent", color: machineFilter === "GRUNWALD" ? "#fff" : "var(--text-muted)", transition: "all 0.2s" }}
          >
            GRUNWALD
          </button>
        </div>
      </div>
      
      {filteredRows.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>Aucune donnée d&apos;ordonnancement disponible.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg-app)", borderBottom: "2px solid var(--border-color)" }}>
                <th style={{ padding: "12px", fontWeight: "600", color: "var(--text-main)" }}>Commande</th>
                <th style={{ padding: "12px", fontWeight: "600", color: "var(--text-main)" }}>Produit</th>
                <th style={{ padding: "12px", fontWeight: "600", color: "var(--text-main)" }}>Machine</th>
                <th style={{ padding: "12px", fontWeight: "600", color: "var(--text-main)" }}>Début</th>
                <th style={{ padding: "12px", fontWeight: "600", color: "var(--text-main)" }}>Fin</th>
                <th style={{ padding: "12px", fontWeight: "600", color: "var(--text-main)" }}>Durée</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "12px", color: "var(--text-main)" }}>{r.commandName}</td>
                  <td style={{ padding: "12px", fontWeight: "500" }}>{r.refName}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ 
                      background: r.machine.includes("ATIA") ? "var(--primary-light)" : "var(--info-light)",
                      color: r.machine.includes("ATIA") ? "var(--primary)" : "var(--info)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      fontWeight: "600"
                    }}>
                      {r.machine}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "var(--text-main)", fontWeight: "500" }}>{getTheoTime(r.startMin, productionStartTime)}</td>
                  <td style={{ padding: "12px", color: "var(--text-main)", fontWeight: "500" }}>{getTheoTime(r.endMin, productionStartTime)}</td>
                  <td style={{ padding: "12px", color: "var(--text-muted)" }}>{r.duration} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
