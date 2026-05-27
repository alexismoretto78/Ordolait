"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { setOrderQty, setGramPerPot } from "../lib/orderSlice"

export default function Commande() {
  const dispatch = useDispatch()
  const { orderQty, gramPerPot, whiteMassKg, status } = useSelector(
    (state: RootState) => state.order
  )

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
            value={orderQty}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => dispatch(setOrderQty(parseNumber(event.target.value)))}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Grammage par pot (g)
          <input
            type="text"
            inputMode="decimal"
            step="any"
            value={gramPerPot}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => dispatch(setGramPerPot(parseNumber(event.target.value)))}
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
