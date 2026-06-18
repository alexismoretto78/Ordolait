"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "./lib/store"
import { setActiveCommand, completeSimulation } from "./lib/orderSlice"
import TLC from "./components/tlc"
import Commande from "./components/commande"
import Journee from "./components/journee"
import Gantt from "./components/gantt"
import Ordo from "./components/ordo"

export default function Home() {
  const dispatch = useDispatch()
  const { commands, activeCommandId, tlcBatches, needs48hWash, needsC3Wash } = useSelector((state: RootState) => state.order)
  const [activeTab, setActiveTab] = useState<"tableau_de_bord" | "commandes" | "reception" | "planning" | "ordo">("tableau_de_bord")

  useEffect(() => {
    dispatch(completeSimulation())
  }, [commands, tlcBatches, needs48hWash, needsC3Wash, dispatch])

  useEffect(() => {
    if (commands.length === 0) {
      setActiveTab("commandes")
    }
  }, [commands.length])

  const handleTabChange = (tab: "tableau_de_bord" | "commandes" | "reception" | "planning" | "ordo") => {
    setActiveTab(tab)
  }

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1>Gestion de commande — Industrie laitière</h1>
        <p>
          Gérez vos lots de lait cru, planifiez vos commandes clients multi-références,
          suivez le process de concentration automatique par osmose et pilotez vos lignes de conditionnement.
        </p>

        {/* Global Active Command Selector directly in Header */}
        {commands.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 20, backgroundColor: "var(--primary-light)", padding: "10px 20px", borderRadius: "var(--radius-md)", border: "1px dashed var(--primary-border)", maxWidth: "500px", margin: "20px auto 0 auto" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
              Commande active :
            </span>
            <select
              value={activeCommandId}
              onChange={(e) => dispatch(setActiveCommand(e.target.value))}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid var(--primary-border)",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "var(--primary)",
                outline: "none",
                cursor: "pointer"
              }}
            >
              {commands.map((cmd) => (
                <option key={cmd.id} value={cmd.id}>
                  {cmd.name} ({(cmd.references.reduce((s, r) => s + r.potsQty, 0) / 1000).toFixed(0)}k pots)
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* Premium Tab Navigation Menu */}
      <div
        className="mobile-tab-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "36px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px)",
          padding: "6px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-md)",
          maxWidth: "700px",
          margin: "0 auto 36px auto",
          position: "sticky",
          top: "20px",
          zIndex: 100
        }}
      >
        <button
          type="button"
          onClick={() => handleTabChange("tableau_de_bord")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: activeTab === "tableau_de_bord" ? "700" : "500",
            backgroundColor: activeTab === "tableau_de_bord" ? "var(--primary)" : "transparent",
            color: activeTab === "tableau_de_bord" ? "#ffffff" : "var(--text-muted)",
            cursor: "pointer",
            transition: "var(--transition)",
            boxShadow: activeTab === "tableau_de_bord" ? "var(--shadow-md)" : "none",
          }}
        >
          <span>📊</span> Tableau de bord
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("planning")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: activeTab === "planning" ? "700" : "500",
            backgroundColor: activeTab === "planning" ? "var(--primary)" : "transparent",
            color: activeTab === "planning" ? "#ffffff" : "var(--text-muted)",
            cursor: "pointer",
            transition: "var(--transition)",
            boxShadow: activeTab === "planning" ? "var(--shadow-md)" : "none",
          }}
        >
          <span>📈</span> Planning Gantt
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("commandes")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: activeTab === "commandes" ? "700" : "500",
            backgroundColor: activeTab === "commandes" ? "var(--primary)" : "transparent",
            color: activeTab === "commandes" ? "#ffffff" : "var(--text-muted)",
            cursor: "pointer",
            transition: "var(--transition)",
            boxShadow: activeTab === "commandes" ? "var(--shadow-md)" : "none",
          }}
        >
          <span>📋</span> Commandes
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("reception")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: activeTab === "reception" ? "700" : "500",
            backgroundColor: activeTab === "reception" ? "var(--primary)" : "transparent",
            color: activeTab === "reception" ? "#ffffff" : "var(--text-muted)",
            cursor: "pointer",
            transition: "var(--transition)",
            boxShadow: activeTab === "reception" ? "var(--shadow-md)" : "none",
          }}
        >
          <span>🥛</span> Réception
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("ordo")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: activeTab === "ordo" ? "700" : "500",
            backgroundColor: activeTab === "ordo" ? "var(--primary)" : "transparent",
            color: activeTab === "ordo" ? "#ffffff" : "var(--text-muted)",
            cursor: "pointer",
            transition: "var(--transition)",
            boxShadow: activeTab === "ordo" ? "var(--shadow-md)" : "none",
          }}
        >
          <span>⏱️</span> Ordo
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "tableau_de_bord" && (
        <div className="dashboard-grid">
          <section className="full-width-section">
            <Journee />
          </section>
        </div>
      )}

      {activeTab === "commandes" && (
        <div className="dashboard-grid">
          <section className="full-width-section">
            <Commande />
          </section>
        </div>
      )}

      {activeTab === "planning" && (
        <div className="dashboard-grid">
          <section className="full-width-section">
            <Gantt />
          </section>
        </div>
      )}

      {activeTab === "reception" && (
        <div className="dashboard-grid">
          <section className="full-width-section">
            <TLC />
          </section>
        </div>
      )}

      {activeTab === "ordo" && (
        <div className="dashboard-grid">
          <section className="full-width-section">
            <Ordo />
          </section>
        </div>
      )}
    </main>
  )
}
