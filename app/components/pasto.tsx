"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { performPasteurize } from "../lib/orderSlice"

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

        <button
          type="button"
          onClick={() => dispatch(performPasteurize())}
          disabled={osmosedVolume <= 0}
          style={{ width: 180, padding: 10, marginTop: 8 }}
        >
          Pasteuriser
        </button>

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
