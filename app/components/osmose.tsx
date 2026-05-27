"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import {
  setMilkReceptionValue,
  setTargetValue,
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

  const parseNumber = (value: string) => Number(value.trim().replace(",", ".") || "0")
  const fcv = milkReceptionValue > 0 ? targetValue / milkReceptionValue : 0

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>2. Osmose du lait</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        <label>
          Valeur à réception
          <input
            type="number"
            inputMode="decimal"
            step="any"
            value={milkReceptionValue}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) =>
              dispatch(setMilkReceptionValue(parseNumber(event.target.value)))
            }
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Valeur cible après osmose
          <input
            type="number"
            inputMode="decimal"
            step="any"
            value={targetValue}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) =>
              dispatch(setTargetValue(parseNumber(event.target.value)))
            }
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <div>
          <strong>FCV</strong>
          <p>{fcv > 0 ? fcv.toFixed(3) : "-"}</p>
        </div>

        <div>
          <strong>Volume estimé après osmose</strong>
          <p>{osmosedVolume.toFixed(3)} L</p>
        </div>

        <div>
          <strong>Volume de lait cru</strong>
          <p>{milkReceivedVolume.toFixed(3)} L</p>
        </div>

        <div>
          <small>Statut de processus : {status}</small>
        </div>
      </div>
    </div>
  )
}
