"use client"

import Commande from "./components/commande"
import Osmose from "./components/osmose"
import TLS from "./components/tls"
import TTLC from "./components/ttlc"
import Pasto from "./components/pasto"
import Cuve from "./components/cuve"
import Gantt from "./components/gantt"

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Gestion de commande - Industrie laitière</h1>
      <p>
        Crée une commande client en nombre de pots, calcule la masse blanche requise,
        concentre le lait par osmose, pasteurise, stocke en cuves et envoie la masse
        blanche aux machines Atia et Grunwald.
      </p>

      <section style={{ marginTop: 24 }}>
        <Commande />
      </section>

      <section style={{ marginTop: 24 }}>
        <Osmose />
      </section>

      <section style={{ marginTop: 24 }}>
        <TTLC />
      </section>

      <section style={{ marginTop: 24 }}>
        <TLS />
      </section>

      <section style={{ marginTop: 24 }}>
        <Pasto />
      </section>

      <section style={{ marginTop: 24 }}>
        <Cuve />
      </section>

      <section style={{ marginTop: 24 }}>
        <Gantt />
      </section>
    </main>
  )
}
