"use client"

import { useState, useEffect } from "react"
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

  const [localMilkReception, setLocalMilkReception] = useState(milkReceptionValue.toString())
  const [localTarget, setLocalTarget] = useState(targetValue.toString())

  useEffect(() => {
    const parsed = Number(localMilkReception.trim().replace(",", ".") || "0")
    if (parsed !== milkReceptionValue) {
      setLocalMilkReception(milkReceptionValue.toString())
    }
  }, [milkReceptionValue])

  useEffect(() => {
    const parsed = Number(localTarget.trim().replace(",", ".") || "0")
    if (parsed !== targetValue) {
      setLocalTarget(targetValue.toString())
    }
  }, [targetValue])

  const parseNumber = (value: string) => Number(value.trim().replace(",", ".") || "0")
  const fcv = milkReceptionValue > 0 ? targetValue / milkReceptionValue : 0

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>2. Osmose du lait</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        <label>
          Valeur à réception
          <input
            type="text"
            step="any"
            value={localMilkReception}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => {
              const val = event.target.value
              setLocalMilkReception(val)
              dispatch(setMilkReceptionValue(parseNumber(val)))
            }}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Valeur cible après osmose
          <input
            type="text"
            inputMode="decimal"
            step="any"
            value={localTarget}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => {
              const val = event.target.value
              setLocalTarget(val)
              dispatch(setTargetValue(parseNumber(val)))
            }}
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
