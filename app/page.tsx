"use client"

import { useState } from "react"
import TLC from "./components/tlc"
import Commande from "./components/commande"
import Osmose from "./components/osmose"
import TLS from "./components/tls"
import Cuve from "./components/cuve"
import Lancement from "./components/lancement"
import Gantt from "./components/gantt"
import Simulation from "./components/simulation"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"commandes" | "tlc" | "simulation">("tlc")

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1>Gestion de commande — Industrie laitière</h1>
        <p>
          Créez une commande client en nombre de pots, calculez la masse blanche requise,
          concentrez le lait par osmose, gérez vos cuves et planifiez votre production globale.
        </p>
      </header>

      {/* Premium Tab Navigation Menu */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: "36px",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(16px)",
          padding: "6px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-md)",
          maxWidth: "640px",
          margin: "0 auto 36px auto",
          position: "sticky",
          top: "20px",
          zIndex: 100
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("tlc")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: activeTab === "tlc" ? "700" : "500",
            backgroundColor: activeTab === "tlc" ? "var(--primary)" : "transparent",
            color: activeTab === "tlc" ? "#ffffff" : "var(--text-muted)",
            cursor: "pointer",
            transition: "var(--transition)",
            boxShadow: activeTab === "tlc" ? "var(--shadow-md)" : "none",
          }}
        >
          <span>🥛</span> Stock de Lait Cru (TLC)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("commandes")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: activeTab === "commandes" ? "700" : "500",
            backgroundColor: activeTab === "commandes" ? "var(--primary)" : "transparent",
            color: activeTab === "commandes" ? "#ffffff" : "var(--text-muted)",
            cursor: "pointer",
            transition: "var(--transition)",
            boxShadow: activeTab === "commandes" ? "var(--shadow-md)" : "none",
          }}
        >
          <span>📋</span> Commandes & Cuves
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("simulation")}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontSize: "0.95rem",
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

      {/* Tab Contents */}
      {activeTab === "commandes" && (
        <div className="dashboard-grid">
          <section>
            <Commande />
          </section>

          <section>
            <Osmose />
          </section>

          <section className="full-width-section">
            <TLS />
          </section>

          <section className="full-width-section">
            <Cuve />
          </section>

          <section className="full-width-section">
            <Lancement />
          </section>
        </div>
      )}

      {activeTab === "tlc" && (
        <div className="dashboard-grid">
          <section className="full-width-section">
            <TLC />
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
