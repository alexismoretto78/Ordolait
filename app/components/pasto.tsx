"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"

export default function Pasto() {
  const dispatch = useDispatch()
  const { osmosedVolume, pasteurized, status } = useSelector(
    (state: RootState) => state.order
  )

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>3. Pasteurisation</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        <div>
          <strong>Volume à pasteuriser</strong>
          <p>{osmosedVolume.toFixed(3)} L</p>
        </div>

        <div>
          <em>La pasteurisation est automatique une fois le volume calculé.</em>
        </div>

        <div>
          <strong>Pasteurisé</strong>
          <p>{pasteurized ? "Oui" : "Non"}</p>
        </div>

        <div>
          <small>Statut de processus : {status}</small>
        </div>
      </div>
    </div>
  )
}
