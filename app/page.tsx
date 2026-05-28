"use client"

import TLC from "./components/tlc"
import Commande from "./components/commande"
import Osmose from "./components/osmose"
import TLS from "./components/tls"
import Cuve from "./components/cuve"
import Lancement from "./components/lancement"
import Gantt from "./components/gantt"
import Simulation from "./components/simulation"

export default function Home() {
  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1>Gestion de commande — Industrie laitière</h1>
        <p>
          Créez une commande client en nombre de pots, calculez la masse blanche requise,
          concentrez le lait par osmose, stockez en cuves et envoyez la masse
          blanche aux machines ATIA et GRUNWALD.
        </p>
      </header>

      <div className="dashboard-grid">
        <section>
          <TLC />
        </section>

        <section>
          <Commande />
        </section>

        <section>
          <Osmose />
        </section>

        <section>
          <TLS />
        </section>

        <section className="full-width-section">
          <Cuve />
        </section>

        <section className="full-width-section">
          <Lancement />
        </section>

        <section className="full-width-section">
          <Gantt />
        </section>

        <section className="full-width-section">
          <Simulation />
        </section>
      </div>
    </main>
  )
}
