"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../lib/store"
import { setOrderQty, setGramPerPot, resetOrder } from "../lib/orderSlice"

export default function Commande() {
  const dispatch = useDispatch()
  const { orderQty, gramPerPot, whiteMassKg, status } = useSelector(
    (state: RootState) => state.order
  )

  return (
    <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>1. Commande client</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 440 }}>
        <label>
          Nombre de pots
          <input
            type="number"
            min={0}
            value={orderQty}
            onChange={(event) =>
              dispatch(setOrderQty(Number(event.target.value)))
            }
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Grammage par pot (g)
          <input
            type="number"
            min={0}
            value={gramPerPot}
            onChange={(event) =>
              dispatch(setGramPerPot(Number(event.target.value)))
            }
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

        <button
          type="button"
          onClick={() => dispatch(resetOrder())}
          style={{ width: 140, padding: 10, marginTop: 8 }}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  )
}
