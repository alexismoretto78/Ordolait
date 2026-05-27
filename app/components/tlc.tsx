"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { TLC_TANKS, setTLCVolume } from "../lib/orderSlice"

export default function TLC() {
  const dispatch = useDispatch()
  const { tlcVolumes, tlcRemaining, milkReceivedVolume } = useSelector((state: RootState) => state.order)

  const parseNumber = (value: string) => Number(value.trim().replace(",", ".") || "0")

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Gestion TLC</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 600 }}>
        <p>Stocks initiaux par défaut: 30000 L (modifiable)</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {TLC_TANKS.map((tank, idx) => {
            const key = (`tlc${idx + 1}`) as keyof typeof tlcVolumes
            return (
              <label key={tank.name}>
                {tank.name}
                <input
                  type="text"
                  inputMode="decimal"
                  step="any"
                  value={tlcVolumes[key]}
                  onFocus={(e) => e.currentTarget.select()}
                  onChange={(e) => dispatch(setTLCVolume({ tank: key, volume: parseNumber(e.target.value) }))}
                  style={{ width: "100%", marginTop: 4 }}
                />
              </label>
            )
          })}
        </div>

        <div>
          <strong>Volume réservé pour la commande</strong>
          <p>{milkReceivedVolume.toFixed(3)} L</p>
        </div>

        <div>
          <strong>Stocks après déduction</strong>
          <p>TLC1: {tlcRemaining.tlc1.toFixed(3)} L — TLC2: {tlcRemaining.tlc2.toFixed(3)} L</p>
          <p>TLC3: {tlcRemaining.tlc3.toFixed(3)} L — TLC4: {tlcRemaining.tlc4.toFixed(3)} L</p>
        </div>
      </div>
    </div>
  )
}
