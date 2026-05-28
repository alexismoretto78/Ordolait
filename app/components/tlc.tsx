"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { TLC_TANKS, setTLCVolume } from "../lib/orderSlice"

export default function TLC() {
  const dispatch = useDispatch()
  const { tlcVolumes, tlcRemaining, milkReceivedVolume } = useSelector((state: RootState) => state.order)

  const [localTlcVolumes, setLocalTlcVolumes] = useState(() => ({
    tlc1: tlcVolumes.tlc1.toString(),
    tlc2: tlcVolumes.tlc2.toString(),
    tlc3: tlcVolumes.tlc3.toString(),
    tlc4: tlcVolumes.tlc4.toString(),
  }))

  useEffect(() => {
    const keys: (keyof typeof tlcVolumes)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
    const updated = { ...localTlcVolumes }
    let changed = false
    for (const key of keys) {
      const parsed = Number(localTlcVolumes[key].trim().replace(",", ".") || "0")
      if (parsed !== tlcVolumes[key]) {
        updated[key] = tlcVolumes[key].toString()
        changed = true
      }
    }
    if (changed) {
      setLocalTlcVolumes(updated)
    }
  }, [tlcVolumes])

  const parseNumber = (value: string) => Number(value.trim().replace(",", ".") || "0")

  return (
    <div className="card">
      <h2>Gestion TLC</h2>
      <div className="form-grid">
        <p className="status-text" style={{ margin: 0 }}>
          Stocks initiaux par défaut : 30 000 L (modifiables)
        </p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {TLC_TANKS.map((tank, idx) => {
            const key = (`tlc${idx + 1}`) as keyof typeof tlcVolumes
            return (
              <div key={tank.name} className="form-group">
                <label className="form-label">
                  {tank.name}
                  <input
                    type="text"
                    inputMode="decimal"
                    step="any"
                    value={localTlcVolumes[key]}
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) => {
                      const val = e.target.value
                      setLocalTlcVolumes((prev) => ({ ...prev, [key]: val }))
                      dispatch(setTLCVolume({ tank: key, volume: parseNumber(val) }))
                    }}
                    className="form-input"
                  />
                </label>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
