"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { assignCuve, sendToMachine } from "../lib/orderSlice"

const cuves = [
  "CF1",
  "CF2",
  "CF3",
  "CF4",
  "CF5",
  "CF11",
  "CF12",
  "CF13",
  "CF14",
  "CF15",
  "CF16",
  "CF17",
]

export default function Cuve() {
  const dispatch = useDispatch()
  const { pasteurized, cuve, sentAtia, sentGrunwald, status, whiteMassKg } =
    useSelector((state: RootState) => state.order)

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>4. Stockage en cuve et envoi machines</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        <label>
          Cuve de destination
          <select
            value={cuve}
            onChange={(event) => dispatch(assignCuve(event.target.value))}
            disabled={!pasteurized}
            style={{ width: "100%", marginTop: 4 }}
          >
            <option value="">Sélectionner une cuve</option>
            {cuves.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <strong>Masse blanche à expédier</strong>
          <p>{whiteMassKg.toFixed(3)} kg</p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={!pasteurized || !cuve}
            onClick={() => dispatch(sendToMachine("atia"))}
            style={{ padding: 10 }}
          >
            Envoyer à Atia
          </button>
          <button
            type="button"
            disabled={!pasteurized || !cuve}
            onClick={() => dispatch(sendToMachine("grunwald"))}
            style={{ padding: 10 }}
          >
            Envoyer à Grunwald
          </button>
        </div>

        <div>
          <p>Cuve sélectionnée : {cuve || "Aucune"}</p>
          <p>Atia : {sentAtia ? "OK" : "En attente"}</p>
          <p>Grunwald : {sentGrunwald ? "OK" : "En attente"}</p>
          <small>Statut de processus : {status}</small>
        </div>
      </div>
    </div>
  )
}
