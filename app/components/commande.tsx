"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { addCommand, deleteCommand, completeCommand, setActiveCommand, updateCommandName, updateCommand, setRefDestination, launchRefToMachine, reorderCommands } from "../lib/orderSlice"

const ALL_PRESETS = [
  { name: "BAIKO", grams: 105 },
  { name: "MDD", grams: 105 },
  { name: "SKYR", grams: 125 },
  { name: "VAL DE PRAZ", grams: 105 },
  { name: "NATURE", grams: 125 }
]

export default function Commande() {
  const dispatch = useDispatch()
  const { commands, completedCommands, activeCommandId, simulationResults } = useSelector((state: RootState) => state.order)

  const [activeSubTab, setActiveSubTab] = useState<"encours" | "ajouter" | "terminees">("encours")

  useEffect(() => {
    if (commands.length === 0 && completedCommands.length === 0) {
      setActiveSubTab("ajouter")
    }
  }, [commands.length, completedCommands.length])

  // Form states for adding a command
  const [newCmdName, setNewCmdName] = useState("Nouvelle Commande")
  const [newCmdStartDate, setNewCmdStartDate] = useState(new Date().toISOString().slice(0, 16))
  const [newCmdEndDate, setNewCmdEndDate] = useState("")
  const [newCmdRefs, setNewCmdRefs] = useState([{ refName: "BAIKO", potsQty: 20000, gramPerPot: 105 }])

  const [editingCmdId, setEditingCmdId] = useState<string | null>(null)
  const [editCmdName, setEditCmdName] = useState("")
  const [editCmdStartDate, setEditCmdStartDate] = useState("")
  const [editCmdEndDate, setEditCmdEndDate] = useState("")
  const [editCmdRefs, setEditCmdRefs] = useState<{ refName: string; potsQty: number; gramPerPot: number }[]>([])

  const handleEditCommand = (cmd: any) => {
    setEditingCmdId(cmd.id)
    setEditCmdName(cmd.name)
    setEditCmdStartDate(cmd.startDate || "")
    setEditCmdEndDate(cmd.expectedEndDate || "")
    setEditCmdRefs(cmd.references.map((r: any) => ({ refName: r.name, potsQty: r.potsQty, gramPerPot: r.gramPerPot })))
  }

  const handleSaveEditCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCmdId) return
    dispatch(updateCommand({
      id: editingCmdId,
      name: editCmdName,
      startDate: editCmdStartDate,
      expectedEndDate: editCmdEndDate,
      references: editCmdRefs.map(r => ({ ...r, potsQty: Number(r.potsQty), gramPerPot: Number(r.gramPerPot) }))
    }))
    setEditingCmdId(null)
  }

  const handleAddCommand = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(addCommand({
      name: newCmdName,
      startDate: newCmdStartDate,
      expectedEndDate: newCmdEndDate,
      references: newCmdRefs.map(r => ({ ...r, potsQty: Number(r.potsQty), gramPerPot: Number(r.gramPerPot) }))
    }))
    setActiveSubTab("encours")
    setNewCmdName("Nouvelle Commande")
    setNewCmdRefs([{ refName: "BAIKO", potsQty: 20000, gramPerPot: 105 }])
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const startIndexStr = e.dataTransfer.getData("text/plain");
    if (!startIndexStr) return;
    const startIndex = parseInt(startIndexStr, 10);
    if (startIndex !== index && !isNaN(startIndex)) {
      dispatch(reorderCommands({ startIndex, endIndex: index }));
    }
  };

  const nowMs = Date.now()

  // Calculate total white mass and breakdown (subtracting already produced mass)
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
            onClick={() => setActiveSubTab("terminees")}
            className={`btn ${activeSubTab === "terminees" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
          >
            Commandes terminées
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

      {commands.length > 0 && (
        <div style={{ background: "var(--primary-light)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--primary-border)", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "var(--primary)", fontSize: "1.1rem" }}>Quantité de masse blanche requise</h3>
              <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>Total RESTANT à produire (déduit des pasteurisations)</p>
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary-dark)" }}>
              {totalWhiteMass.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L
            </div>
          </div>
          
          {Object.keys(whiteMassBreakdown).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", borderTop: "1px solid rgba(59, 130, 246, 0.2)", paddingTop: "12px" }}>
              {Object.entries(whiteMassBreakdown).map(([type, mass]) => (
                <div key={type} style={{ background: "#fff", padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-border)", display: "flex", alignItems: "center", gap: "8px", boxShadow: "var(--shadow-sm)" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.85rem" }}>{type}</span>
                  <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "0.95rem" }}>{mass.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} L</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "encours" && (
        <div>
          {commands.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
              Aucune commande en cours.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {commands.map((cmd, index) => {
                const isActive = cmd.id === activeCommandId
                const startMs = new Date(cmd.startDate || 0).getTime()
                const isUpcoming = startMs > nowMs
                
                return (
                  <div 
                    key={cmd.id}
                    draggable={editingCmdId !== cmd.id}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => {
                      if (editingCmdId !== cmd.id) dispatch(setActiveCommand(cmd.id))
                    }}
                    style={{
                      border: `1px solid ${isActive ? "var(--primary)" : "var(--border-color)"}`,
                      backgroundColor: isActive ? "var(--primary-light)" : (isUpcoming ? "#f8fafc" : "#ffffff"),
                      opacity: isUpcoming && !isActive ? 0.65 : 1,
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      cursor: editingCmdId === cmd.id ? "default" : "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      transition: "var(--transition)"
                    }}
                  >
                    {editingCmdId === cmd.id ? (
                      <form onSubmit={handleSaveEditCommand} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                        <h4 style={{ margin: 0, color: "var(--primary)" }}>Modifier la commande</h4>
                        
                        <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                          Nom de la commande
                          <input 
                            type="text" 
                            value={editCmdName} 
                            onChange={(e) => setEditCmdName(e.target.value)}
                            required
                            style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                          />
                        </label>

                        <div style={{ display: "flex", gap: "16px" }}>
                          <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                            Date et heure de début
                            <input 
                              type="datetime-local" 
                              value={editCmdStartDate} 
                              onChange={(e) => setEditCmdStartDate(e.target.value)}
                              required
                              style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                            />
                          </label>

                          <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                            Date et heure de fin souhaitée
                            <input 
                              type="datetime-local" 
                              value={editCmdEndDate} 
                              onChange={(e) => setEditCmdEndDate(e.target.value)}
                              style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                            />
                          </label>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                          <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem" }}>Références</h4>
                          {editCmdRefs.map((refItem, index) => (
                            <div key={index} style={{ display: "flex", gap: "8px", alignItems: "flex-end", marginBottom: "10px", padding: "10px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                              <label style={{ flex: 2, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                                Référence
                                <select 
                                  value={refItem.refName} 
                                  onChange={(e) => {
                                    const newName = e.target.value
                                    const preset = ALL_PRESETS.find(p => p.name === newName)
                                    const updated = [...editCmdRefs]
                                    updated[index] = { ...updated[index], refName: newName }
                                    if (preset) updated[index].gramPerPot = preset.grams
                                    setEditCmdRefs(updated)
                                  }}
                                  required
                                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                                >
                                  <option value="" disabled>-- Sélectionner --</option>
                                  {ALL_PRESETS.map(p => (
                                    <option key={p.name} value={p.name}>{p.name}</option>
                                  ))}
                                </select>
                              </label>

                              <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                                Pots
                                <input 
                                  type="number" 
                                  value={refItem.potsQty} 
                                  onChange={(e) => {
                                    const updated = [...editCmdRefs]
                                    updated[index] = { ...updated[index], potsQty: Number(e.target.value) }
                                    setEditCmdRefs(updated)
                                  }}
                                  required min="1"
                                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                                />
                              </label>

                              <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                                g/pot
                                <input 
                                  type="number" 
                                  value={refItem.gramPerPot} 
                                  onChange={(e) => {
                                    const updated = [...editCmdRefs]
                                    updated[index] = { ...updated[index], gramPerPot: Number(e.target.value) }
                                    setEditCmdRefs(updated)
                                  }}
                                  required min="1"
                                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                                />
                              </label>

                              {editCmdRefs.length > 1 && (
                                <button 
                                  type="button" 
                                  onClick={() => setEditCmdRefs(editCmdRefs.filter((_, i) => i !== index))}
                                  className="btn btn-secondary" 
                                  style={{ padding: "8px", color: "var(--danger)", border: "1px solid var(--border-color)" }}
                                  title="Supprimer la référence"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={() => setEditCmdRefs([...editCmdRefs, { refName: "BAIKO", potsQty: 20000, gramPerPot: 105 }])}
                            className="btn btn-secondary"
                            style={{ fontSize: "0.85rem", padding: "6px 12px", marginTop: "4px" }}
                          >
                            + Ajouter une référence
                          </button>
                        </div>

                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
                          <button type="button" onClick={() => setEditingCmdId(null)} className="btn btn-secondary">Annuler</button>
                          <button type="submit" className="btn btn-success">Enregistrer</button>
                        </div>
                      </form>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", color: isActive ? "var(--primary)" : "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ cursor: "grab", opacity: 0.5, fontSize: "1.2rem", marginRight: "4px" }} title="Glisser-déposer pour réordonner">☰</span>
                            <input
                              type="text"
                              value={cmd.name}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => dispatch(updateCommandName({ id: cmd.id, name: e.target.value }))}
                              style={{
                                border: "1px dashed transparent",
                                borderBottom: "1px dashed var(--border-color)",
                                background: "transparent",
                                color: "inherit",
                                fontWeight: "inherit",
                                fontSize: "inherit",
                                fontFamily: "inherit",
                                padding: "2px 4px",
                                outline: "none",
                                width: "auto",
                                minWidth: "200px"
                              }}
                              onFocus={(e) => { e.target.style.border = "1px dashed var(--primary)"; e.target.style.borderBottom = "1px dashed var(--primary)" }}
                              onBlur={(e) => { e.target.style.border = "1px dashed transparent"; e.target.style.borderBottom = "1px dashed var(--border-color)" }}
                              title="Cliquez pour renommer la commande"
                            />
                            {isUpcoming && <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "normal" }}>(À venir)</span>}
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
                          <div style={{ marginTop: "8px", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                            {cmd.references.map(r => (
                              <div key={r.id} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                <span><strong>{r.name}</strong> - {r.potsQty} pots ({r.gramPerPot}g)</span>
                                
                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: "4px" }}>Machine :</span>
                                  {(["atia", "grunwald", "both"] as const).map((d) => {
                                    const isSelected = cmd.refDestinations?.[r.id] === d
                                    const label = d === "atia" ? "ATIA" : d === "grunwald" ? "GRUNWALD" : "Les deux"
                                    return (
                                      <button
                                        key={d}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          dispatch(setRefDestination({ cmdId: cmd.id, refId: r.id, destination: d }))
                                          if (d === "atia" || d === "both") dispatch(launchRefToMachine({ cmdId: cmd.id, refId: r.id, machine: "atia" }))
                                          if (d === "grunwald" || d === "both") dispatch(launchRefToMachine({ cmdId: cmd.id, refId: r.id, machine: "grunwald" }))
                                        }}
                                        style={{
                                          padding: "4px 8px",
                                          borderRadius: "4px",
                                          fontSize: "0.75rem",
                                          fontWeight: isSelected ? "bold" : "normal",
                                          border: `1px solid ${isSelected ? "var(--primary)" : "var(--border-color)"}`,
                                          background: isSelected ? "var(--primary-light)" : "white",
                                          color: isSelected ? "var(--primary)" : "var(--text-muted)",
                                          cursor: "pointer",
                                          transition: "var(--transition)"
                                        }}
                                      >
                                        {label}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {simulationResults?.commandsResults[cmd.id]?.error && (
                            <div style={{ marginTop: "12px", padding: "8px", backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
                              ⚠️ {simulationResults.commandsResults[cmd.id].error}
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditCommand(cmd)
                            }}
                            className="btn btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                            title="Modifier la commande"
                          >
                            ✏️ Modifier
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm("Valider la fin de cette commande ? Elle sera déplacée vers les terminées.")) {
                                dispatch(completeCommand(cmd.id))
                              }
                            }}
                            className="btn btn-primary"
                            style={{ padding: "6px 12px", fontSize: "0.85rem", backgroundColor: "var(--success)" }}
                            title="Valider que la production est terminée"
                          >
                            ✅ Terminer
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm("Supprimer cette commande ?")) {
                                dispatch(deleteCommand(cmd.id))
                              }
                            }}
                            className="btn btn-secondary"
                            style={{ color: "var(--danger)", border: "none", background: "none", fontSize: "1.2rem", padding: "4px" }}
                            title="Supprimer la commande"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "terminees" && (
        <div>
          {completedCommands.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
              Aucune commande terminée.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {completedCommands.map(cmd => (
                <div 
                  key={cmd.id}
                  style={{
                    border: "1px solid var(--border-color)",
                    backgroundColor: "#f1f5f9",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "var(--text-muted)" }}>
                      {cmd.name}
                      <span style={{ marginLeft: "8px", fontSize: "0.8rem", backgroundColor: "var(--success)", color: "white", padding: "2px 6px", borderRadius: "4px" }}>Terminée</span>
                    </h4>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "16px" }}>
                      <span><strong>Début :</strong> {cmd.startDate ? new Date(cmd.startDate).toLocaleString() : "Non défini"}</span>
                    </div>
                    <div style={{ marginTop: "8px", fontSize: "0.85rem", opacity: 0.8 }}>
                      {cmd.references.map(r => (
                        <span key={r.id} style={{ display: "inline-block", marginRight: "12px", background: "#e2e8f0", padding: "2px 8px", borderRadius: "12px" }}>
                          {r.name} - {r.potsQty} pots ({r.gramPerPot}g)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "ajouter" && (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", backgroundColor: "#f8fafc" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", textAlign: "center" }}>Nouvelle Commande</h3>
          <form onSubmit={handleAddCommand} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
              Nom de la commande
              <input 
                type="text" 
                value={newCmdName} 
                onChange={(e) => setNewCmdName(e.target.value)}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
              />
            </label>

            <div style={{ display: "flex", gap: "16px" }}>
              <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Date et heure de début
                <input 
                  type="datetime-local" 
                  value={newCmdStartDate} 
                  onChange={(e) => setNewCmdStartDate(e.target.value)}
                  required
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                />
              </label>

              <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Date et heure de fin souhaitée
                <input 
                  type="datetime-local" 
                  value={newCmdEndDate} 
                  onChange={(e) => setNewCmdEndDate(e.target.value)}
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                />
              </label>
            </div>

            <div style={{ marginTop: "10px" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>Références de la commande</h4>
              {newCmdRefs.map((refItem, index) => (
                <div key={index} style={{ display: "flex", gap: "8px", alignItems: "flex-end", marginBottom: "10px", padding: "10px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                  <label style={{ flex: 2, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Référence
                    <select 
                      value={refItem.refName} 
                      onChange={(e) => {
                        const newName = e.target.value
                        const preset = ALL_PRESETS.find(p => p.name === newName)
                        const updated = [...newCmdRefs]
                        updated[index] = { ...updated[index], refName: newName }
                        if (preset) {
                          updated[index].gramPerPot = preset.grams
                        }
                        setNewCmdRefs(updated)
                      }}
                      required
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                    >
                      <option value="" disabled>-- Sélectionner --</option>
                      {ALL_PRESETS.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </label>

                  <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Nombre de pots
                    <input 
                      type="number" 
                      value={refItem.potsQty} 
                      onChange={(e) => {
                        const updated = [...newCmdRefs]
                        updated[index] = { ...updated[index], potsQty: Number(e.target.value) }
                        setNewCmdRefs(updated)
                      }}
                      required
                      min="1"
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                    />
                  </label>

                  <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                    Grammage (g)
                    <input 
                      type="number" 
                      value={refItem.gramPerPot} 
                      onChange={(e) => {
                        const updated = [...newCmdRefs]
                        updated[index] = { ...updated[index], gramPerPot: Number(e.target.value) }
                        setNewCmdRefs(updated)
                      }}
                      required
                      min="1"
                      style={{ padding: "8px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                    />
                  </label>

                  {newCmdRefs.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => setNewCmdRefs(newCmdRefs.filter((_, i) => i !== index))}
                      className="btn btn-secondary" 
                      style={{ padding: "8px", color: "var(--danger)", border: "1px solid var(--border-color)", marginBottom: "1px" }}
                      title="Supprimer la référence"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setNewCmdRefs([...newCmdRefs, { refName: "BAIKO", potsQty: 20000, gramPerPot: 105 }])}
                className="btn btn-secondary"
                style={{ fontSize: "0.85rem", padding: "6px 12px", marginTop: "4px" }}
              >
                + Ajouter une référence
              </button>
            </div>

            <button type="submit" className="btn btn-success" style={{ marginTop: "20px", padding: "10px", fontSize: "1rem", fontWeight: "bold" }}>
              ✓ Valider la commande
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
