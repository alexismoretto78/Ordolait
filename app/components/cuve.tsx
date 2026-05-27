"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import {
  sendToMachine,
  CF_TANKS,
  toggleCuveSelection,
} from "../lib/orderSlice"

export default function Cuve() {
  const dispatch = useDispatch()
  const { pasteurized, selectedCFs, sentAtia, sentGrunwald, status, whiteMassKg, osmosedVolume, milkReceivedVolume } =
    useSelector((state: RootState) => state.order)

  const selectedCapacity = selectedCFs.reduce((total, name) => {
    const tank = CF_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

  const volumeForCF = osmosedVolume
  const remainingVolume = Math.max(0, volumeForCF - selectedCapacity)

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>4. Stockage en cuve et envoi machines</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        <div>
          <strong>Cuves de destination</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {CF_TANKS.map((tank) => {
              const selected = selectedCFs.includes(tank.name)
              return (
                <button
                  key={tank.name}
                  type="button"
                  onClick={() => dispatch(toggleCuveSelection(tank.name))}
                  disabled={!pasteurized || (!selected && selectedCapacity >= volumeForCF)}
                  style={{
                    padding: 10,
                    border: selected ? "2px solid #0070f3" : "1px solid #ccc",
                    background: selected ? "#e6f0ff" : "white",
                    cursor: pasteurized ? "pointer" : "not-allowed",
                  }}
                >
                  {tank.name} ({tank.capacity} L)
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <strong>Volume assigné</strong>
          <p>{selectedCapacity.toFixed(3)} / {volumeForCF.toFixed(3)} L</p>
          <p>Volume restant : {remainingVolume.toFixed(3)} L</p>
        </div>

        <div>
          <strong>Masse blanche à expédier</strong>
          <p>{whiteMassKg.toFixed(3)} kg</p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={!pasteurized || selectedCFs.length === 0}
            onClick={() => dispatch(sendToMachine("atia"))}
            style={{ padding: 10 }}
          >
            Envoyer à Atia
          </button>
          <button
            type="button"
            disabled={!pasteurized || selectedCFs.length === 0}
            onClick={() => dispatch(sendToMachine("grunwald"))}
            style={{ padding: 10 }}
          >
            Envoyer à Grunwald
          </button>
        </div>

        <div>
          <p>Cuves sélectionnées : {selectedCFs.length ? selectedCFs.join(", ") : "Aucune"}</p>
          <p>Atia : {sentAtia ? "OK" : "En attente"}</p>
          <p>Grunwald : {sentGrunwald ? "OK" : "En attente"}</p>
          <small>Statut de processus : {status}</small>
        </div>
      </div>
    </div>
  )
}
