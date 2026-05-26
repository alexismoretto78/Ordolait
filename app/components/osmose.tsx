"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import {
  setMilkReceivedVolume,
  setMilkReceptionValue,
  setTargetValue,
  performOsmose,
} from "../lib/orderSlice"

export default function Osmose() {
  const dispatch = useDispatch()
  const {
    milkReceivedVolume,
    milkReceptionValue,
    targetValue,
    osmosedVolume,
    status,
  } = useSelector((state: RootState) => state.order)

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>2. Osmose du lait</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        <label>
          Volume de lait reçu (L)
          <input
            type="number"
            min={0}
            value={milkReceivedVolume}
            onChange={(event) =>
              dispatch(setMilkReceivedVolume(Number(event.target.value)))
            }
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Valeur à réception
          <input
            type="number"
            min={0}
            value={milkReceptionValue}
            onChange={(event) =>
              dispatch(setMilkReceptionValue(Number(event.target.value)))
            }
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Valeur cible après osmose
          <input
            type="number"
            min={0}
            value={targetValue}
            onChange={(event) => dispatch(setTargetValue(Number(event.target.value)))}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <button
          type="button"
          onClick={() => dispatch(performOsmose())}
          style={{ width: 140, padding: 10, marginTop: 8 }}
        >
          Lancer osmose
        </button>

        <div>
          <strong>Volume estimé après osmose</strong>
          <p>{osmosedVolume.toFixed(3)} L</p>
        </div>

        <div>
          <small>Statut de processus : {status}</small>
        </div>
      </div>
    </div>
  )
}
