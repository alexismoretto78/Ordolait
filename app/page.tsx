"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./lib/store"
import { reset, step, toggleRunning } from "./lib/simulatorSlice"

export default function Home() {
  const dispatch = useDispatch()
  const { time, running, value } = useSelector(
    (state: RootState) => state.simulator
  )

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      dispatch(step(1))
    }, 1000)
    return () => clearInterval(interval)
  }, [dispatch, running])

  return (
    <main>
      <h1>Optimisateur de fabrication de lait</h1>
      <div>
        <p>Temps : {time.toFixed(0)} s</p>
        <p>Valeur : {value.toFixed(2)}</p>
        <p>Simulation : {running ? "En cours" : "En pause"}</p>
      </div>
      <div>
        <button onClick={() => dispatch(toggleRunning())}>
          {running ? "Pause" : "Lancer"}
        </button>
        <button onClick={() => dispatch(reset())}>Réinitialiser</button>
      </div>
    </main>
  )
}
