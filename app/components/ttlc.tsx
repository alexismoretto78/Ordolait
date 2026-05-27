"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { setTLCVolume, TLC_TANKS } from "../lib/orderSlice"

export default function TTLC() {
  const dispatch = useDispatch()
  const { tlcVolumes } = useSelector((state: RootState) => state.order)

  const parseNumber = (value: string) => Number(value.trim().replace(",", ".") || "0")

  const handleVolumeChange = (tank: keyof typeof tlcVolumes, value: number) => {
    dispatch(setTLCVolume({ tank, volume: value }))
  }

  const totalVolume = Object.values(tlcVolumes).reduce((sum, vol) => sum + vol, 0)

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>3. Réservoirs TLC (Transfert)</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        {TLC_TANKS.map((tank) => {
          const key = tank.name.toLowerCase() as keyof typeof tlcVolumes
          return (
            <label key={tank.name}>
              {tank.name} (Capacité: {tank.capacity.toLocaleString()} L)
              <input
                type="text"
                inputMode="decimal"
                step="any"
                value={tlcVolumes[key]}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => {
                  const volume = parseNumber(event.target.value)
                  if (volume <= tank.capacity) {
                    handleVolumeChange(key, volume)
                  }
                }}
                style={{ width: "100%", marginTop: 4 }}
              />
            </label>
          )
        })}

        <div>
          <strong>Volume total dans les TLC</strong>
          <p>{totalVolume.toFixed(3)} L</p>
        </div>

        <div>
          <strong>Espace disponible</strong>
          <p>{(120000 - totalVolume).toFixed(3)} L</p>
        </div>
      </div>
    </div>
  )
}
