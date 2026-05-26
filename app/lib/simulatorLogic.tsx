import { useEffect, useState } from "react"

export type SimulatorState = {
  time: number
  running: boolean
  value: number
}

export function createInitialState(): SimulatorState {
  return { time: 0, running: true, value: 0 }
}

export function step(state: SimulatorState, dt = 1): SimulatorState {
  return {
    ...state,
    time: state.time + dt,
    value: state.value + (Math.random() - 0.5),
  }
}

export function useSimulator(initial?: SimulatorState, intervalMs = 1000) {
  const [state, setState] = useState<SimulatorState>(initial ?? createInitialState())

  useEffect(() => {
    if (!state.running) return
    const id = setInterval(() => {
      setState((s) => step(s, intervalMs / 1000))
    }, intervalMs)
    return () => clearInterval(id)
  }, [state.running, intervalMs])

  return { state, setState }
}
