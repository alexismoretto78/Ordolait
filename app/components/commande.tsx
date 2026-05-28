"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { setOrderQty, setGramPerPot } from "../lib/orderSlice"

export default function Commande() {
  const dispatch = useDispatch()
  const { orderQty, gramPerPot, whiteMassKg, status } = useSelector(
    (state: RootState) => state.order
  )

  const [localOrderQty, setLocalOrderQty] = useState(orderQty.toString())
  const [localGramPerPot, setLocalGramPerPot] = useState(gramPerPot.toString())

  useEffect(() => {
    const parsed = Number(localOrderQty.trim().replace(",", ".") || "0")
    if (parsed !== orderQty) {
      setLocalOrderQty(orderQty.toString())
    }
  }, [orderQty])

  useEffect(() => {
    const parsed = Number(localGramPerPot.trim().replace(",", ".") || "0")
    if (parsed !== gramPerPot) {
      setLocalGramPerPot(gramPerPot.toString())
    }
  }, [gramPerPot])

  const parseNumber = (value: string) => Number(value.trim().replace(",", ".") || "0")

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>1. Commande client</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        <label>
          Nombre de pots
          <input
            type="text"
            inputMode="decimal"
            step="any"
            value={localOrderQty}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => {
              const val = event.target.value
              setLocalOrderQty(val)
              dispatch(setOrderQty(parseNumber(val)))
            }}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Grammage par pot (g)
          <input
            type="text"
            inputMode="decimal"
            step="any"
            value={localGramPerPot}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => {
              const val = event.target.value
              setLocalGramPerPot(val)
              dispatch(setGramPerPot(parseNumber(val)))
            }}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <div>
          <strong>Masse blanche requise</strong>
          <p>{whiteMassKg.toFixed(3)} kg</p>
        </div>

        <div>
          <small>Statut de la commande : {status}</small>
        </div>
      </div>
    </div>
  )
}
