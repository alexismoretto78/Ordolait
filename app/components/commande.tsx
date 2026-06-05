"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { addCommand, deleteCommand, setActiveCommand } from "../lib/orderSlice"

export default function Commande() {
  const dispatch = useDispatch()
  const { commands, activeCommandId } = useSelector((state: RootState) => state.order)

  const [activeSubTab, setActiveSubTab] = useState<"encours" | "ajouter">("encours")

  // Form states for adding a command
  const [newCmdStartDate, setNewCmdStartDate] = useState(new Date().toISOString().slice(0, 16))
  const [newCmdEndDate, setNewCmdEndDate] = useState("")
  const [newCmdRef, setNewCmdRef] = useState("Baiko Nature")
  const [newCmdPots, setNewCmdPots] = useState("20000")
  const [newCmdGrams, setNewCmdGrams] = useState("125")

  const handleAddCommand = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(addCommand({
      startDate: newCmdStartDate,
      expectedEndDate: newCmdEndDate,
      refName: newCmdRef,
      potsQty: Number(newCmdPots),
      gramPerPot: Number(newCmdGrams)
    }))
    setActiveSubTab("encours")
  }

  const nowMs = Date.now()

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Gestion des Commandes Produits</h2>
        
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setActiveSubTab("encours")}
            className={`btn ${activeSubTab === "encours" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
          >
            Commandes en cours
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("ajouter")}
            className={`btn ${activeSubTab === "ajouter" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
          >
            ➕ Ajouter une commande
          </button>
        </div>
      </div>

      {activeSubTab === "encours" && (
        <div>
          {commands.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
              Aucune commande en cours.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {commands.map(cmd => {
                const isActive = cmd.id === activeCommandId
                const startMs = new Date(cmd.startDate || 0).getTime()
                const isUpcoming = startMs > nowMs
                
                return (
                  <div 
                    key={cmd.id}
                    onClick={() => dispatch(setActiveCommand(cmd.id))}
                    style={{
                      border: `1px solid ${isActive ? "var(--primary)" : "var(--border-color)"}`,
                      backgroundColor: isActive ? "var(--primary-light)" : (isUpcoming ? "#f8fafc" : "#ffffff"),
                      opacity: isUpcoming ? 0.65 : 1,
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "var(--transition)"
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", color: isActive ? "var(--primary)" : "var(--text-main)" }}>
                        {cmd.name} {isUpcoming && "(À venir)"}
                      </h4>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "16px" }}>
                        <span><strong>Début :</strong> {cmd.startDate ? new Date(cmd.startDate).toLocaleString() : "Non défini"}</span>
                        <span>
                          <strong>Fin souhaitée :</strong> {cmd.expectedEndDate ? new Date(cmd.expectedEndDate).toLocaleString() : "Non définie"}
                        </span>
                        <span>
                          <strong>Fin calculée :</strong> {cmd.calculatedEndDate ? new Date(cmd.calculatedEndDate).toLocaleString() : "En attente"}
                        </span>
                      </div>
                      <div style={{ marginTop: "8px", fontSize: "0.85rem" }}>
                        {cmd.references.map(r => (
                          <span key={r.id} style={{ display: "inline-block", marginRight: "12px", background: "#e2e8f0", padding: "2px 8px", borderRadius: "12px" }}>
                            {r.name} - {r.potsQty} pots ({r.gramPerPot}g)
                          </span>
                        ))}
                      </div>
                    </div>

                    {commands.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          dispatch(deleteCommand(cmd.id))
                        }}
                        className="btn btn-secondary"
                        style={{ color: "var(--danger)", border: "none", background: "none", fontSize: "1.2rem" }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "ajouter" && (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", backgroundColor: "#f8fafc" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", textAlign: "center" }}>Nouvelle Commande</h3>
          <form onSubmit={handleAddCommand} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Date et heure de début
              <input 
                type="datetime-local" 
                value={newCmdStartDate} 
                onChange={(e) => setNewCmdStartDate(e.target.value)}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Date et heure de fin souhaitée
              <input 
                type="datetime-local" 
                value={newCmdEndDate} 
                onChange={(e) => setNewCmdEndDate(e.target.value)}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Référence du produit
              <input 
                type="text" 
                value={newCmdRef} 
                onChange={(e) => setNewCmdRef(e.target.value)}
                required
                placeholder="Ex: Baiko Nature, Skyr..."
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
              />
            </label>

            <div style={{ display: "flex", gap: "16px" }}>
              <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Nombre de pots
                <input 
                  type="number" 
                  value={newCmdPots} 
                  onChange={(e) => setNewCmdPots(e.target.value)}
                  required
                  min="1"
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                />
              </label>

              <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Grammage (g)
                <input 
                  type="number" 
                  value={newCmdGrams} 
                  onChange={(e) => setNewCmdGrams(e.target.value)}
                  required
                  min="1"
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                />
              </label>
            </div>

            <button type="submit" className="btn btn-success" style={{ marginTop: "10px", padding: "10px", fontSize: "1rem", fontWeight: "bold" }}>
              ✓ Valider la commande
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
