"use client";

import React, { useEffect, useState } from "react";

type Reference = {
  id: string;
  name: string;
  potsQty: number;
  gramPerPot: number;
};

type CompletedCommand = {
  id: string;
  name: string;
  status: string;
  whiteMassKg: number;
  milkReceivedVolume: number;
  targetValue: number;
  osmosedVolume: number;
  milkType: string;
  isSkyr: boolean;
  completedAt: string;
  references: Reference[];
};

type CompletedReception = {
  id: string;
  lotNumber: string;
  volume: number;
  protein: number;
  fat: number;
  milkType: string;
  deliveryDate: string;
  completedAt: string;
};

export default function Historique() {
  const [commands, setCommands] = useState<CompletedCommand[]>([]);
  const [receptions, setReceptions] = useState<CompletedReception[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"commands" | "receptions">("commands");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCommandId, setExpandedCommandId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [cmdRes, recRes] = await Promise.all([
          fetch("/api/commands"),
          fetch("/api/receptions")
        ]);
        
        if (cmdRes.ok) {
          const cmdData = await cmdRes.json();
          setCommands(cmdData);
        }
        
        if (recRes.ok) {
          const recData = await recRes.json();
          setReceptions(recData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.milkType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredReceptions = receptions.filter(rec => 
    rec.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.milkType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCommandDetails = (id: string) => {
    if (expandedCommandId === id) {
      setExpandedCommandId(null);
    } else {
      setExpandedCommandId(id);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
            <span style={{ fontSize: "1.5rem" }}>🗄️</span> Historique de Production
          </h2>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.2rem" }}>🔍</span>
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                outline: "none",
                fontSize: "0.95rem",
                width: "250px"
              }}
            />
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <button
            onClick={() => { setView("commands"); setSearchQuery(""); }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--primary-border)",
              backgroundColor: view === "commands" ? "var(--primary)" : "transparent",
              color: view === "commands" ? "#fff" : "var(--primary)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Commandes Terminées ({commands.length})
          </button>
          <button
            onClick={() => { setView("receptions"); setSearchQuery(""); }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--primary-border)",
              backgroundColor: view === "receptions" ? "var(--primary)" : "transparent",
              color: view === "receptions" ? "#fff" : "var(--primary)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Réceptions Terminées ({receptions.length})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <div className="spinner" style={{ margin: "0 auto 10px auto" }}></div>
            Chargement des données...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            {view === "commands" ? (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                    <th style={{ padding: "12px", color: "var(--text-muted)", width: "40px" }}></th>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>Date</th>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>Nom</th>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>Statut</th>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>Lait / Type</th>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>Masse Blanche</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommands.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                        Aucune commande trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredCommands.map((cmd) => (
                      <React.Fragment key={cmd.id}>
                        <tr 
                          onClick={() => toggleCommandDetails(cmd.id)}
                          style={{ 
                            borderBottom: expandedCommandId === cmd.id ? "none" : "1px solid var(--border-color)", 
                            transition: "background 0.2s",
                            cursor: "pointer",
                            backgroundColor: expandedCommandId === cmd.id ? "var(--bg-light)" : "transparent"
                          }} 
                          onMouseOver={(e) => { if (expandedCommandId !== cmd.id) e.currentTarget.style.backgroundColor = "var(--bg-light)" }} 
                          onMouseOut={(e) => { if (expandedCommandId !== cmd.id) e.currentTarget.style.backgroundColor = "transparent" }}
                        >
                          <td style={{ padding: "12px", color: "var(--primary)", textAlign: "center" }}>
                            {expandedCommandId === cmd.id ? "▼" : "▶"}
                          </td>
                          <td style={{ padding: "12px", fontSize: "0.9rem", fontWeight: 500 }}>{formatDate(cmd.completedAt)}</td>
                          <td style={{ padding: "12px", fontWeight: 600 }}>{cmd.name}</td>
                          <td style={{ padding: "12px" }}>
                            <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "0.8rem", backgroundColor: "var(--primary-light)", color: "var(--primary)", fontWeight: 700 }}>
                              {cmd.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px", fontSize: "0.9rem" }}>
                            {cmd.milkReceivedVolume.toFixed(0)} L - <span style={{ textTransform: "uppercase", fontWeight: 600 }}>{cmd.milkType}</span> {cmd.isSkyr ? "(Skyr)" : ""}
                          </td>
                          <td style={{ padding: "12px", fontWeight: 600 }}>
                            {cmd.whiteMassKg.toFixed(0)} kg
                          </td>
                        </tr>
                        {expandedCommandId === cmd.id && (
                          <tr style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--bg-light)" }}>
                            <td colSpan={6} style={{ padding: "0 20px 20px 20px" }}>
                              <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "var(--radius-md)", border: "1px dashed var(--primary-border)" }}>
                                <h4 style={{ margin: "0 0 12px 0", color: "var(--primary)", fontSize: "0.95rem", display: "flex", justifyContent: "space-between" }}>
                                  <span>Détails Techniques</span>
                                  <span>Volume osmosé : {cmd.osmosedVolume.toFixed(0)} L (Cible TB: {cmd.targetValue}%)</span>
                                </h4>
                                {cmd.references && cmd.references.length > 0 ? (
                                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                                    <thead>
                                      <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                                        <th style={{ padding: "8px 0", textAlign: "left" }}>Référence</th>
                                        <th style={{ padding: "8px 0", textAlign: "right" }}>Quantité (pots)</th>
                                        <th style={{ padding: "8px 0", textAlign: "right" }}>Poids/pot (g)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {cmd.references.map((ref) => (
                                        <tr key={ref.id} style={{ borderBottom: "1px dashed #eaeaea" }}>
                                          <td style={{ padding: "8px 0", fontWeight: 600 }}>{ref.name}</td>
                                          <td style={{ padding: "8px 0", textAlign: "right" }}>{ref.potsQty.toLocaleString("fr-FR")}</td>
                                          <td style={{ padding: "8px 0", textAlign: "right" }}>{ref.gramPerPot} g</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>Aucune référence associée.</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>Date Réception</th>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>N° Lot</th>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>Lait</th>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>Volume</th>
                    <th style={{ padding: "12px", color: "var(--text-muted)" }}>MG / MP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                        Aucune réception trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredReceptions.map((rec) => (
                      <tr key={rec.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--bg-light)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                        <td style={{ padding: "12px", fontSize: "0.9rem", fontWeight: 500 }}>{formatDate(rec.deliveryDate)}</td>
                        <td style={{ padding: "12px", fontWeight: 600, color: "var(--primary)" }}>{rec.lotNumber}</td>
                        <td style={{ padding: "12px", textTransform: "uppercase", fontWeight: 600, fontSize: "0.9rem" }}>
                          {rec.milkType}
                        </td>
                        <td style={{ padding: "12px", fontWeight: 600 }}>
                          {rec.volume.toFixed(0)} L
                        </td>
                        <td style={{ padding: "12px", fontSize: "0.9rem" }}>
                          <span style={{ color: "var(--accent)" }}>{rec.fat}%</span> / <span style={{ color: "var(--primary)" }}>{rec.protein}%</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
