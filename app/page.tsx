"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "./lib/store"
import { setActiveCommand, completeSimulation } from "./lib/orderSlice"
import TLC from "./components/tlc"
import Commande from "./components/commande"
import Osmose from "./components/osmose"
import TLS from "./components/tls"
import Cuve from "./components/cuve"
import Lancement from "./components/lancement"
import Gantt from "./components/gantt"
import Simulation from "./components/simulation"

export default function Home() {
  const dispatch = useDispatch()
  const { commands, activeCommandId, tlcBatches, needs48hWash, needsC3Wash } = useSelector((state: RootState) => state.order)
  const [activeTab, setActiveTab] = useState<"tlc" | "commandes" | "production" | "lancement" | "simulation">("commandes")

  useEffect(() => {
    dispatch(completeSimulation())
  }, [commands, tlcBatches, needs48hWash, needsC3Wash, dispatch])

  useEffect(() => {
    if (commands.length === 0) {
      setActiveTab("commandes")
    }
  }, [commands.length])

  const handleTabChange = (tab: "tlc" | "commandes" | "production" | "lancement" | "simulation") => {
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
      {commands.length > 0 && (
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
            maxWidth: "960px",
            margin: "0 auto 36px auto",
            position: "sticky",
            top: "20px",
            zIndex: 100
          }}
        >
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
            <span>📋</span> Commandes Clients
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("tlc")}
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
              fontWeight: activeTab === "tlc" ? "700" : "500",
              backgroundColor: activeTab === "tlc" ? "var(--primary)" : "transparent",
              color: activeTab === "tlc" ? "#ffffff" : "var(--text-muted)",
              cursor: "pointer",
              transition: "var(--transition)",
              boxShadow: activeTab === "tlc" ? "var(--shadow-md)" : "none",
            }}
          >
            <span>🥛</span> Réception & Lots TLC
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("production")}
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
              fontWeight: activeTab === "production" ? "700" : "500",
              backgroundColor: activeTab === "production" ? "var(--primary)" : "transparent",
              color: activeTab === "production" ? "#ffffff" : "var(--text-muted)",
              cursor: "pointer",
              transition: "var(--transition)",
              boxShadow: activeTab === "production" ? "var(--shadow-md)" : "none",
            }}
          >
            <span>🏭</span> Flux de Production
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("lancement")}
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
              fontWeight: activeTab === "lancement" ? "700" : "500",
              backgroundColor: activeTab === "lancement" ? "var(--primary)" : "transparent",
              color: activeTab === "lancement" ? "#ffffff" : "var(--text-muted)",
              cursor: "pointer",
              transition: "var(--transition)",
              boxShadow: activeTab === "lancement" ? "var(--shadow-md)" : "none",
            }}
          >
            <span>🚀</span> Pilotage Machines
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("simulation")}
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
              fontWeight: activeTab === "simulation" ? "700" : "500",
              backgroundColor: activeTab === "simulation" ? "var(--primary)" : "transparent",
              color: activeTab === "simulation" ? "#ffffff" : "var(--text-muted)",
              cursor: "pointer",
              transition: "var(--transition)",
              boxShadow: activeTab === "simulation" ? "var(--shadow-md)" : "none",
            }}
          >
            <span>📊</span> Simulation & Gantt
          </button>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === "tlc" && (
        <div className="dashboard-grid">
          <section className="full-width-section">
            <TLC />
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

      {activeTab === "production" && (
        <div className="dashboard-grid">
          <section>
            <TLS />
          </section>

          <section>
            <Osmose />
          </section>

          <section className="full-width-section">
            <Cuve />
          </section>
        </div>
      )}

      {activeTab === "lancement" && (
        <div className="dashboard-grid">
          <section className="full-width-section">
            <Lancement />
          </section>
        </div>
      )}

      {activeTab === "simulation" && (
        <div className="dashboard-grid">
          <section className="full-width-section">
            <Gantt />
          </section>

          <section className="full-width-section">
            <Simulation />
          </section>
        </div>
      )}
    </main>
  )
}
