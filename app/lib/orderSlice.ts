import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type TimingInfo = {
  transferTime: number // minutes TLC->TLS
  osmoseTime: number // minutes
  powderTime: number // minutes
  pastoTime: number // minutes
  startTime: number // timestamp
  maturationTime: number // minutes (maturation in cuves)
}

export type Command = {
  id: string
  name: string
  orderQty: number
  gramPerPot: number
  whiteMassKg: number
  milkReceivedVolume: number
  milkReceptionValue: number
  targetValue: number
  tlsVolumes: { tls1: number; tls2: number; tls3: number }
  selectedTLSs: string[]
  selectedCFs: string[]
  cfDestinations: { [tankName: string]: "atia" | "grunwald" | "both" }
  cfSentStatus: { [tankName: string]: { atia: boolean; grunwald: boolean } }
  timing: TimingInfo
  status: "idle" | "order" | "osmosis" | "pasto" | "cuve" | "dispatched"
  osmosedVolume: number
  pasteurized: boolean
}

export type CommandSimResult = {
  id: string
  name: string
  transferStart: number
  transferEnd: number
  osmoseStart: number
  osmoseEnd: number
  powderStart: number
  powderEnd: number
  pastoStart: number
  pastoEnd: number
  maturationStart: number
  maturationEnd: number
  packagingStart: number
  packagingEnd: number
  packagingAtiaDuration: number
  packagingGrunDuration: number
  totalDuration: number
}

export type GanttTask = {
  key: string
  label: string
  startMinute: number
  durationMinutes: number
  color: string
}

export type MultiCommandSimResults = {
  totalDurationMinutes: number
  commandsResults: { [id: string]: CommandSimResult }
  tlcRemaining: { tlc1: number; tlc2: number; tlc3: number; tlc4: number }
  ganttTasks: GanttTask[]
}

export type OrderState = {
  // Shared root fallbacks (for backward compatibility)
  orderQty: number
  gramPerPot: number
  whiteMassKg: number
  milkReceivedVolume: number
  milkReceptionValue: number
  targetValue: number
  tlsVolumes: { tls1: number; tls2: number; tls3: number }
  tlcVolumes: { tlc1: number; tlc2: number; tlc3: number; tlc4: number }
  tlcRemaining: { tlc1: number; tlc2: number; tlc3: number; tlc4: number }
  osmosedVolume: number
  pasteurized: boolean
  selectedCFs: string[]
  selectedTLSs: string[]
  sentAtia: boolean
  sentGrunwald: boolean
  timing: TimingInfo
  status: "idle" | "order" | "osmosis" | "pasto" | "cuve" | "dispatched"
  cfDestinations: { [tankName: string]: "atia" | "grunwald" | "both" }
  cfSentStatus: { [tankName: string]: { atia: boolean; grunwald: boolean } }
  productionStartTime: string
  
  // Simulation status fields
  isSimulating: boolean
  simulationDone: boolean
  simulationProgress: number
  simulationStepText: string
  
  // Results
  simulatedTiming: TimingInfo
  simulatedTlcRemaining: { tlc1: number; tlc2: number; tlc3: number; tlc4: number }
  simulatedMilkReceivedVolume: number
  simulatedOsmosedVolume: number

  // New multi-command states
  commands: Command[]
  activeCommandId: string
  simulationResults?: MultiCommandSimResults
}

const initialCommand = (id: string, name: string): Command => {
  const selectedCFs = ["CF4", "CF5", "CF1", "CF2", "CF3", "CF11", "CF12", "CF13", "CF14", "CF15"]
  const cfDestinations: { [tankName: string]: "atia" | "grunwald" | "both" } = {}
  const cfSentStatus: { [tankName: string]: { atia: boolean; grunwald: boolean } } = {}
  
  selectedCFs.forEach(name => {
    cfDestinations[name] = "both"
    cfSentStatus[name] = { atia: false, grunwald: false }
  })

  return {
    id,
    name,
    orderQty: 120000,
    gramPerPot: 120,
    whiteMassKg: 14400,
    milkReceivedVolume: 17890.909,
    milkReceptionValue: 33,
    targetValue: 41,
    tlsVolumes: { tls1: 11000, tls2: 5200, tls3: 1690.909 },
    selectedTLSs: ["TLS1", "TLS2", "TLS3"],
    selectedCFs,
    cfDestinations,
    cfSentStatus,
    timing: { transferTime: 68.8, osmoseTime: 309.6, powderTime: 108, pastoTime: 172.8, startTime: 0, maturationTime: 360 },
    status: "cuve",
    osmosedVolume: 14400,
    pasteurized: true,
  }
}

const initialState: OrderState = {
  orderQty: 120000,
  gramPerPot: 120,
  whiteMassKg: 14400,
  milkReceivedVolume: 17890.909,
  milkReceptionValue: 33,
  targetValue: 41,
  tlsVolumes: { tls1: 11000, tls2: 5200, tls3: 1690.909 },
  tlcVolumes: { tlc1: 30000, tlc2: 30000, tlc3: 30000, tlc4: 30000 },
  tlcRemaining: { tlc1: 30000, tlc2: 30000, tlc3: 30000, tlc4: 30000 },
  osmosedVolume: 14400,
  pasteurized: true,
  selectedCFs: ["CF4", "CF5", "CF1", "CF2", "CF3", "CF11", "CF12", "CF13", "CF14", "CF15"],
  selectedTLSs: ["TLS1", "TLS2", "TLS3"],
  sentAtia: false,
  sentGrunwald: false,
  timing: { transferTime: 68.8, osmoseTime: 309.6, powderTime: 108, pastoTime: 172.8, startTime: 0, maturationTime: 360 },
  status: "cuve",
  cfDestinations: {},
  cfSentStatus: {},
  productionStartTime: "",
  isSimulating: false,
  simulationDone: false,
  simulationProgress: 0,
  simulationStepText: "",
  simulatedTiming: { transferTime: 68.8, osmoseTime: 309.6, powderTime: 108, pastoTime: 172.8, startTime: 0, maturationTime: 360 },
  simulatedTlcRemaining: { tlc1: 30000, tlc2: 30000, tlc3: 30000, tlc4: 30000 },
  simulatedMilkReceivedVolume: 0,
  simulatedOsmosedVolume: 0,

  // Start with one default command
  commands: [initialCommand("cmd-1", "Commande 1")],
  activeCommandId: "cmd-1",
}

const computeWhiteMass = (orderQty: number, gramPerPot: number) =>
  Number(((orderQty * gramPerPot) / 1000).toFixed(3))

const TLS_TANKS = [
  { name: "TLS1", capacity: 11000 },
  { name: "TLS2", capacity: 5200 },
  { name: "TLS3", capacity: 5200 },
]

const TLC_TANKS = [
  { name: "TLC1", capacity: 30000 },
  { name: "TLC2", capacity: 30000 },
  { name: "TLC3", capacity: 30000 },
  { name: "TLC4", capacity: 30000 },
]

const CF_TANKS = [
  { name: "CF4", capacity: 550 },
  { name: "CF5", capacity: 550 },
  { name: "CF1", capacity: 1100 },
  { name: "CF2", capacity: 1100 },
  { name: "CF3", capacity: 1100 },
  { name: "CF11", capacity: 2200 },
  { name: "CF12", capacity: 2200 },
  { name: "CF13", capacity: 2200 },
  { name: "CF14", capacity: 2200 },
  { name: "CF15", capacity: 2200 },
  { name: "CF16", capacity: 2200 },
  { name: "CF17", capacity: 2200 },
]

const selectCuvesForVolume = (volume: number) => {
  if (volume <= 0) return []

  const n = CF_TANKS.length
  let bestCombination: typeof CF_TANKS = []
  let bestTotalCapacity = Infinity

  for (let i = 1; i < (1 << n); i++) {
    const currentCombination: typeof CF_TANKS = []
    let currentCapacity = 0

    for (let j = 0; j < n; j++) {
      if ((i & (1 << j)) !== 0) {
        currentCombination.push(CF_TANKS[j])
        currentCapacity += CF_TANKS[j].capacity
      }
    }

    if (currentCapacity >= volume) {
      if (currentCapacity < bestTotalCapacity) {
        bestTotalCapacity = currentCapacity
        bestCombination = currentCombination
      } else if (currentCapacity === bestTotalCapacity) {
        if (currentCombination.length < bestCombination.length) {
          bestCombination = currentCombination
        } else if (currentCombination.length === bestCombination.length) {
          const namesCurrent = currentCombination.map(t => t.name).sort().join(",")
          const namesBest = bestCombination.map(t => t.name).sort().join(",")
          if (namesCurrent < namesBest) {
            bestCombination = currentCombination
          }
        }
      }
    }
  }

  if (bestCombination.length === 0) {
    return CF_TANKS.map(t => t.name)
  }

  return bestCombination.map(t => t.name)
}

const getSelectedCFCapacity = (selectedCFs: string[]) =>
  selectedCFs.reduce((total, name) => {
    const tank = CF_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

const initializeNewCFs = (command: Command) => {
  if (!command.cfDestinations) {
    command.cfDestinations = {}
  }
  if (!command.cfSentStatus) {
    command.cfSentStatus = {}
  }
  
  // Clean up removed tanks
  Object.keys(command.cfDestinations).forEach((name) => {
    if (!command.selectedCFs.includes(name)) {
      delete command.cfDestinations[name]
    }
  })
  Object.keys(command.cfSentStatus).forEach((name) => {
    if (!command.selectedCFs.includes(name)) {
      delete command.cfSentStatus[name]
    }
  })

  // Initialize selected tanks
  command.selectedCFs.forEach((name) => {
    if (!command.cfDestinations[name]) {
      command.cfDestinations[name] = "both"
    }
    if (!command.cfSentStatus[name]) {
      command.cfSentStatus[name] = { atia: false, grunwald: false }
    }
  })
}

const checkIfDispatched = (command: Command) => {
  if (command.selectedCFs.length === 0) return

  let allDone = true

  command.selectedCFs.forEach((name) => {
    const dest = command.cfDestinations[name] || "both"
    const sent = command.cfSentStatus[name] || { atia: false, grunwald: false }

    const needsAtia = dest === "atia" || dest === "both"
    const needsGrunwald = dest === "grunwald" || dest === "both"

    if (needsAtia && !sent.atia) {
      allDone = false
    }

    if (needsGrunwald && !sent.grunwald) {
      allDone = false
    }
  })

  if (allDone) {
    command.status = "dispatched"
  } else {
    if (command.status === "dispatched") {
      command.status = "cuve"
    }
  }
}

const computeRequiredRawMilk = (finalVolume: number, Ci: number, Cf: number) => {
  if (Ci <= 0) return 0
  return Number((finalVolume * Cf / Ci).toFixed(3))
}

const computeOsmosedVolume = (milkVolume: number, reception: number, target: number) => {
  if (milkVolume <= 0 || reception <= 0 || target <= 0) return 0
  return Number((milkVolume * reception / target).toFixed(3))
}

const distributeToTLS = (totalVolume: number) => {
  let remaining = totalVolume
  const alloc = { tls1: 0, tls2: 0, tls3: 0 }
  const caps = TLS_TANKS.map((t) => t.capacity)
  const keys: (keyof typeof alloc)[] = ["tls1", "tls2", "tls3"]
  
  // 1. Initial distribution
  for (let i = 0; i < keys.length; i++) {
    const take = Math.min(remaining, caps[i])
    alloc[keys[i]] = Number(take.toFixed(3))
    remaining = Number((remaining - take).toFixed(3))
    if (remaining <= 0) break
  }

  // 2. Adjustments: no less than 1000 L in active TLS
  for (let i = keys.length - 1; i >= 0; i--) {
    const key = keys[i]
    const volume = alloc[key]
    
    if (volume > 0 && volume < 1000) {
      let needed = Number((1000 - volume).toFixed(3))
      
      for (let d = 1; d < keys.length; d++) {
        const j = (i - d + keys.length) % keys.length
        const otherKey = keys[j]
        const otherVolume = alloc[otherKey]
        
        if (otherVolume > 1000) {
          const available = Number((otherVolume - 1000).toFixed(3))
          const toTake = Math.min(needed, available)
          
          alloc[otherKey] = Number((otherVolume - toTake).toFixed(3))
          alloc[key] = Number((alloc[key] + toTake).toFixed(3))
          needed = Number((needed - toTake).toFixed(3))
          
          if (needed <= 0) break
        }
      }
    }
  }

  return alloc
}

const selectTLSForVolume = (volume: number) => {
  const alloc = distributeToTLS(volume)
  const selected: string[] = []
  if (alloc.tls1 > 0) selected.push("TLS1")
  if (alloc.tls2 > 0) selected.push("TLS2")
  if (alloc.tls3 > 0) selected.push("TLS3")
  return selected
}

const getSelectedTLSCapacity = (selectedTLSs: string[]) =>
  selectedTLSs.reduce((total, name) => {
    const tank = TLS_TANKS.find((t) => t.name === name)
    return total + (tank?.capacity ?? 0)
  }, 0)

const computeTransferTime = (volume: number) => {
  return Number((volume * 20 / 5200).toFixed(1))
}

const computeOsmoseTime = (volume: number, reception: number, target: number) => {
  const fcv = reception > 0 ? target / reception : 1.28
  return Number((volume * (fcv / 1.28) * (90 / 5200)).toFixed(1))
}

const computePowderTime = (volume: number) => {
  return Number((volume * 25 / 4000).toFixed(1))
}

const computePastoTime = (volume: number) => {
  return Number((volume / 5000 * 60).toFixed(1))
}

const DEFAULT_MATURATION_MINUTES = 360

const syncActiveCommandToRoot = (state: OrderState) => {
  const active = state.commands.find(c => c.id === state.activeCommandId)
  if (active) {
    state.orderQty = active.orderQty
    state.gramPerPot = active.gramPerPot
    state.whiteMassKg = active.whiteMassKg
    state.milkReceivedVolume = active.milkReceivedVolume
    state.milkReceptionValue = active.milkReceptionValue
    state.targetValue = active.targetValue
    state.tlsVolumes = active.tlsVolumes
    state.selectedTLSs = active.selectedTLSs
    state.selectedCFs = active.selectedCFs
    state.cfDestinations = active.cfDestinations
    state.cfSentStatus = active.cfSentStatus
    state.timing = active.timing
    state.status = active.status
    state.osmosedVolume = active.osmosedVolume
    state.pasteurized = active.pasteurized
  }
}

const updateActiveCommandFromRoot = (state: OrderState) => {
  const activeIdx = state.commands.findIndex(c => c.id === state.activeCommandId)
  if (activeIdx !== -1) {
    state.commands[activeIdx] = {
      ...state.commands[activeIdx],
      orderQty: state.orderQty,
      gramPerPot: state.gramPerPot,
      whiteMassKg: state.whiteMassKg,
      milkReceivedVolume: state.milkReceivedVolume,
      milkReceptionValue: state.milkReceptionValue,
      targetValue: state.targetValue,
      tlsVolumes: state.tlsVolumes,
      selectedTLSs: state.selectedTLSs,
      selectedCFs: state.selectedCFs,
      cfDestinations: state.cfDestinations,
      cfSentStatus: state.cfSentStatus,
      timing: state.timing,
      status: state.status,
      osmosedVolume: state.osmosedVolume,
      pasteurized: state.pasteurized,
    }
  }
}

const recalculateActiveCommandMetrics = (active: Command) => {
  active.whiteMassKg = computeWhiteMass(active.orderQty, active.gramPerPot)
  active.status = active.orderQty > 0 ? "order" : "idle"

  if (active.whiteMassKg > 0 && active.milkReceptionValue > 0 && active.targetValue > 0) {
    active.milkReceivedVolume = computeRequiredRawMilk(
      active.whiteMassKg,
      active.milkReceptionValue,
      active.targetValue
    )
    active.tlsVolumes = distributeToTLS(active.milkReceivedVolume)
    active.selectedTLSs = selectTLSForVolume(active.milkReceivedVolume)
  }

  active.osmosedVolume = computeOsmosedVolume(
    active.milkReceivedVolume,
    active.milkReceptionValue,
    active.targetValue
  )

  if (active.osmosedVolume > 0) {
    active.pasteurized = true
    active.selectedCFs = selectCuvesForVolume(active.osmosedVolume)
    initializeNewCFs(active)
    active.status = active.selectedCFs.length > 0 ? "cuve" : active.status
  }

  active.timing.transferTime = computeTransferTime(active.milkReceivedVolume)
  active.timing.osmoseTime = computeOsmoseTime(active.milkReceivedVolume, active.milkReceptionValue, active.targetValue)
  active.timing.powderTime = computePowderTime(active.osmosedVolume)
  active.timing.pastoTime = computePastoTime(active.osmosedVolume)
  active.timing.maturationTime = DEFAULT_MATURATION_MINUTES
}

type TLSToSchedule = {
  commandId: string
  commandIdx: number
  commandName: string
  tlsKey: "tls1" | "tls2" | "tls3"
  rawVolume: number
  osmosedVolume: number
  gramPerPot: number
}

// Global simulation executor (advanced TLS-by-TLS scheduling)
export const runMultiCommandSimulation = (
  commands: Command[],
  tlcInitial: { tlc1: number; tlc2: number; tlc3: number; tlc4: number }
): MultiCommandSimResults => {
  let timeOsmosisFree = 0
  let timePowderFree = 0
  let timePastoFree = 0
  let timeGrunwald = 0
  let timeAtia = 0
  
  const tlc = { ...tlcInitial }
  const tlcKeys: (keyof typeof tlc)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
  
  const cfAvailableAt: { [tankName: string]: number } = {}
  CF_TANKS.forEach(t => { cfAvailableAt[t.name] = 0 })
  
  const tlsAvailableAt = { TLS1: 0, TLS2: 0, TLS3: 0 }
  
  const commandsResults: { [id: string]: CommandSimResult } = {}
  const ganttTasks: GanttTask[] = []
  
  const getCommandColor = (idx: number, step: string) => {
    const hues = [220, 142, 275, 38, 345, 95, 195]
    const hue = hues[idx % hues.length]
    switch (step) {
      case "transfer": return `hsl(${hue}, 80%, 60%)`
      case "osmose": return `hsl(${hue}, 75%, 45%)`
      case "pasto": return `hsl(${hue}, 80%, 40%)`
      case "maturation": return `hsl(${hue}, 60%, 50%)`
      case "packaging_atia": return `hsl(${hue}, 50%, 65%)`
      case "packaging_grun": return `hsl(${hue}, 90%, 55%)`
      default: return `hsl(${hue}, 70%, 50%)`
    }
  }

  // Pre-allocate selected CF tanks capacities for each command
  const commandCFAllocations: { [commandId: string]: { [cfName: string]: number } } = {}
  const commandCFSelectedList: { [commandId: string]: string[] } = {}
  
  commands.forEach((cmd) => {
    const selectedCFs = cmd.selectedCFs.length > 0 ? cmd.selectedCFs : selectCuvesForVolume(cmd.osmosedVolume)
    commandCFSelectedList[cmd.id] = selectedCFs
    
    const cfAllocatedVolumes: { [tank: string]: number } = {}
    let remCFVol = cmd.osmosedVolume
    selectedCFs.forEach(cfName => {
      const tank = CF_TANKS.find(t => t.name === cfName)
      const cap = tank?.capacity ?? 0
      const allocated = Math.min(remCFVol, cap)
      cfAllocatedVolumes[cfName] = allocated
      remCFVol = Math.max(0, remCFVol - allocated)
    })
    commandCFAllocations[cmd.id] = cfAllocatedVolumes
  })

  // Build sequential list of all active TLS tasks across all commands
  const tlsList: TLSToSchedule[] = []
  commands.forEach((cmd, cmdIdx) => {
    const tlsAlloc = distributeToTLS(cmd.milkReceivedVolume)
    const activeTLSKeys: (keyof typeof tlsAlloc)[] = ["tls1", "tls2", "tls3"]
    activeTLSKeys.forEach((key) => {
      const vol = tlsAlloc[key]
      if (vol > 0) {
        const osmVol = computeOsmosedVolume(vol, cmd.milkReceptionValue, cmd.targetValue)
        tlsList.push({
          commandId: cmd.id,
          commandIdx: cmdIdx,
          commandName: cmd.name,
          tlsKey: key,
          rawVolume: vol,
          osmosedVolume: osmVol,
          gramPerPot: cmd.gramPerPot,
        })
      }
    })
  })

  // Track the filled volumes of CF tanks per command
  const cfTanksFilledForCommand: { [commandId: string]: { [cfName: string]: number } } = {}
  commands.forEach((cmd) => {
    cfTanksFilledForCommand[cmd.id] = {}
    commandCFSelectedList[cmd.id].forEach(cf => {
      cfTanksFilledForCommand[cmd.id][cf] = 0
    })
  })

  // Track detailed metrics for command results
  const cmdMinStart: { [id: string]: number } = {}
  const cmdMaxEnd: { [id: string]: number } = {}
  const cmdTransStart: { [id: string]: number } = {}
  const cmdTransEnd: { [id: string]: number } = {}
  const cmdOsmoseStart: { [id: string]: number } = {}
  const cmdOsmoseEnd: { [id: string]: number } = {}
  const cmdPastoStart: { [id: string]: number } = {}
  const cmdPastoEnd: { [id: string]: number } = {}

  // Process all TLSs chronologically
  tlsList.forEach((tlsItem) => {
    const TLS_NAME = tlsItem.tlsKey.toUpperCase() as "TLS1" | "TLS2" | "TLS3"
    
    // 1. TLC Consumption
    let remainingToDraw = tlsItem.rawVolume
    for (const key of tlcKeys) {
      if (remainingToDraw <= 0) break
      const draw = Math.min(tlc[key], remainingToDraw)
      tlc[key] = Number((tlc[key] - draw).toFixed(3))
      remainingToDraw = Number((remainingToDraw - draw).toFixed(3))
    }

    // 2. Schedule Transfer TLC -> TLS
    // Starts when physical TLS tank becomes empty from previous uses
    const transferStart = tlsAvailableAt[TLS_NAME]
    const transferDuration = computeTransferTime(tlsItem.rawVolume)
    const transferEnd = transferStart + transferDuration

    if (cmdTransStart[tlsItem.commandId] === undefined) {
      cmdTransStart[tlsItem.commandId] = transferStart
    }
    cmdTransEnd[tlsItem.commandId] = transferEnd

    // 3. Schedule Osmosis
    // Starts when transfer ends and the Osmosis machine is free
    const osmoseStart = Math.max(transferEnd, timeOsmosisFree)
    const cmd = commands.find(c => c.id === tlsItem.commandId)!
    const osmoseDuration = computeOsmoseTime(tlsItem.rawVolume, cmd.milkReceptionValue, cmd.targetValue)
    const osmoseEnd = osmoseStart + osmoseDuration
    timeOsmosisFree = osmoseEnd

    if (cmdOsmoseStart[tlsItem.commandId] === undefined) {
      cmdOsmoseStart[tlsItem.commandId] = osmoseStart
    }
    cmdOsmoseEnd[tlsItem.commandId] = osmoseEnd

    ganttTasks.push({
      key: `${tlsItem.commandId}-${TLS_NAME}-transfer`,
      label: `${tlsItem.commandName} : Transfert ${TLS_NAME}`,
      startMinute: transferStart,
      durationMinutes: transferDuration,
      color: getCommandColor(tlsItem.commandIdx, "transfer"),
    })

    ganttTasks.push({
      key: `${tlsItem.commandId}-${TLS_NAME}-osmose`,
      label: `${tlsItem.commandName} : Osmose ${TLS_NAME}`,
      startMinute: osmoseStart,
      durationMinutes: osmoseDuration,
      color: getCommandColor(tlsItem.commandIdx, "osmose"),
    })

    // 4. Schedule Powdering & Pasteurization (chained without delay!)
    // We select which CF tanks we will fill for this TLS's osmosed volume
    const cfTanksToFill: string[] = []
    const cfFillVolumes: { [cfName: string]: number } = {}
    let remTLSVol = tlsItem.osmosedVolume
    
    const preAllocated = commandCFAllocations[tlsItem.commandId]
    const selectedCFs = commandCFSelectedList[tlsItem.commandId]
    
    selectedCFs.forEach(cfName => {
      if (remTLSVol <= 0) return
      const maxAllocated = preAllocated[cfName] || 0
      const alreadyFilled = cfTanksFilledForCommand[tlsItem.commandId][cfName] || 0
      const capRemaining = maxAllocated - alreadyFilled
      if (capRemaining > 0) {
        const fill = Math.min(remTLSVol, capRemaining)
        cfTanksToFill.push(cfName)
        cfFillVolumes[cfName] = fill
        remTLSVol = Number((remTLSVol - fill).toFixed(3))
        cfTanksFilledForCommand[tlsItem.commandId][cfName] = Number((alreadyFilled + fill).toFixed(3))
      }
    })

    // Compute durations
    const powderDuration = computePowderTime(tlsItem.osmosedVolume)
    const pastoDuration = computePastoTime(tlsItem.osmosedVolume)

    // Pasteurization can start only when:
    // A. Osmosis of this TLS is complete: t >= osmoseEnd
    // B. Pasteurizer is free: t >= timePastoFree
    // C. Powder machine is free: t - powderDuration >= timePowderFree => t >= timePowderFree + powderDuration
    // D. All selected CFs we fill are empty and clean: t >= max(cfAvailableAt[cf])
    let cfReadyTime = 0
    cfTanksToFill.forEach(cfName => {
      cfReadyTime = Math.max(cfReadyTime, cfAvailableAt[cfName] || 0)
    })

    const pastoStart = Math.max(
      osmoseEnd, 
      Math.max(timePastoFree, Math.max(timePowderFree + powderDuration, cfReadyTime))
    )
    const powderStart = pastoStart - powderDuration
    const pastoEnd = pastoStart + pastoDuration

    // Update machines
    timePowderFree = pastoStart // powder finished when pasto started
    timePastoFree = pastoEnd
    tlsAvailableAt[TLS_NAME] = pastoEnd // physical TLS tank empty when pasto ends

    if (cmdPastoStart[tlsItem.commandId] === undefined) {
      cmdPastoStart[tlsItem.commandId] = powderStart
    }
    cmdPastoEnd[tlsItem.commandId] = pastoEnd

    ganttTasks.push({
      key: `${tlsItem.commandId}-${TLS_NAME}-pasto`,
      label: `${tlsItem.commandName} : Poudrage + Pasto ${TLS_NAME}`,
      startMinute: powderStart,
      durationMinutes: powderDuration + pastoDuration,
      color: getCommandColor(tlsItem.commandIdx, "pasto"),
    })

    // 5. Maturation (starts immediately after pasteurization ends)
    const maturationStart = pastoEnd
    const maturationEnd = pastoEnd + 360

    ganttTasks.push({
      key: `${tlsItem.commandId}-${TLS_NAME}-maturation`,
      label: `${tlsItem.commandName} : Maturation ${TLS_NAME}`,
      startMinute: maturationStart,
      durationMinutes: 360,
      color: getCommandColor(tlsItem.commandIdx, "maturation"),
    })

    // 6. Packaging for these CF tanks
    cfTanksToFill.forEach(cfName => {
      const fillVol = cfFillVolumes[cfName]
      const dest = commandCFSelectedList[tlsItem.commandId].includes(cfName) 
        ? (commands.find(c => c.id === tlsItem.commandId)?.cfDestinations?.[cfName] || "both") 
        : "both"
      const pots = (fillVol * 1000) / tlsItem.gramPerPot

      let pkgStart = 0
      let pkgDuration = 0
      let emptyTime = 0

      if (dest === "grunwald") {
        pkgStart = Math.max(maturationEnd, timeGrunwald)
        pkgDuration = (pots / 10000) * 60
        emptyTime = pkgStart + pkgDuration
        timeGrunwald = emptyTime

        ganttTasks.push({
          key: `${tlsItem.commandId}-${cfName}-pkg-grun`,
          label: `${tlsItem.commandName} : Conditionnement ${cfName} (GRUN)`,
          startMinute: pkgStart,
          durationMinutes: pkgDuration,
          color: getCommandColor(tlsItem.commandIdx, "packaging_grun"),
        })
      } else if (dest === "atia") {
        pkgStart = Math.max(maturationEnd, timeAtia)
        pkgDuration = (pots / 3500) * 60
        emptyTime = pkgStart + pkgDuration
        timeAtia = emptyTime

        ganttTasks.push({
          key: `${tlsItem.commandId}-${cfName}-pkg-atia`,
          label: `${tlsItem.commandName} : Conditionnement ${cfName} (ATIA)`,
          startMinute: pkgStart,
          durationMinutes: pkgDuration,
          color: getCommandColor(tlsItem.commandIdx, "packaging_atia"),
        })
      } else { // both
        pkgStart = Math.max(maturationEnd, Math.max(timeGrunwald, timeAtia))
        pkgDuration = (pots / 13500) * 60
        emptyTime = pkgStart + pkgDuration
        timeGrunwald = emptyTime
        timeAtia = emptyTime

        ganttTasks.push({
          key: `${tlsItem.commandId}-${cfName}-pkg-both`,
          label: `${tlsItem.commandName} : Conditionnement ${cfName} (ATIA+GRUN)`,
          startMinute: pkgStart,
          durationMinutes: pkgDuration,
          color: getCommandColor(tlsItem.commandIdx, "packaging_grun"),
        })
      }

      ganttTasks.push({
        key: `${tlsItem.commandId}-${cfName}-wash`,
        label: `${tlsItem.commandName} : Lavage ${cfName}`,
        startMinute: emptyTime,
        durationMinutes: 30,
        color: "#cbd5e1",
      })

      cfAvailableAt[cfName] = emptyTime + 30
      
      if (cmdMaxEnd[tlsItem.commandId] === undefined || emptyTime > cmdMaxEnd[tlsItem.commandId]) {
        cmdMaxEnd[tlsItem.commandId] = emptyTime
      }
    })

    if (cmdMinStart[tlsItem.commandId] === undefined) {
      cmdMinStart[tlsItem.commandId] = transferStart
    }
  })

  // Finalize command results timelines
  commands.forEach(cmd => {
    const V_cru = cmd.milkReceivedVolume
    if (V_cru <= 0) return

    const tStart = cmdMinStart[cmd.id] || 0
    const tEnd = cmdMaxEnd[cmd.id] || (cmdPastoEnd[cmd.id] + 360)

    commandsResults[cmd.id] = {
      id: cmd.id,
      name: cmd.name,
      transferStart: tStart,
      transferEnd: cmdTransEnd[cmd.id] || 0,
      osmoseStart: cmdOsmoseStart[cmd.id] || 0,
      osmoseEnd: cmdOsmoseEnd[cmd.id] || 0,
      powderStart: cmdOsmoseEnd[cmd.id] || 0,
      powderEnd: cmdPastoStart[cmd.id] || 0,
      pastoStart: cmdPastoStart[cmd.id] || 0,
      pastoEnd: cmdPastoEnd[cmd.id] || 0,
      maturationStart: cmdPastoEnd[cmd.id] || 0,
      maturationEnd: cmdPastoEnd[cmd.id] + 360,
      packagingStart: cmdPastoEnd[cmd.id] + 360,
      packagingEnd: tEnd,
      packagingAtiaDuration: timeAtia,
      packagingGrunDuration: timeGrunwald,
      totalDuration: tEnd,
    }
  })

  const totalDurationMinutes = Math.max(
    timeGrunwald,
    timeAtia,
    timePastoFree,
    ...Object.values(cfAvailableAt),
    ...Object.values(tlsAvailableAt)
  )

  return {
    totalDurationMinutes,
    commandsResults,
    tlcRemaining: tlc,
    ganttTasks,
  }
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Multi-command lifecycle management
    addCommand(state) {
      const nextIdx = state.commands.length + 1
      const newCmd = initialCommand(`cmd-${Date.now()}`, `Commande ${nextIdx}`)
      state.commands.push(newCmd)
      state.activeCommandId = newCmd.id
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },
    deleteCommand(state, action: PayloadAction<string>) {
      // Keep at least one command
      if (state.commands.length <= 1) return
      
      const toDelete = action.payload
      state.commands = state.commands.filter(c => c.id !== toDelete)
      
      if (state.activeCommandId === toDelete) {
        state.activeCommandId = state.commands[0].id
      }
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },
    setActiveCommand(state, action: PayloadAction<string>) {
      state.activeCommandId = action.payload
      syncActiveCommandToRoot(state)
    },
    
    // Command-specific setters (modifying the active command)
    setOrderQty(state, action: PayloadAction<number>) {
      state.orderQty = action.payload
      updateActiveCommandFromRoot(state)
      
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        recalculateActiveCommandMetrics(active)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setGramPerPot(state, action: PayloadAction<number>) {
      state.gramPerPot = action.payload
      updateActiveCommandFromRoot(state)
      
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        recalculateActiveCommandMetrics(active)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setMilkReceptionValue(state, action: PayloadAction<number>) {
      state.milkReceptionValue = action.payload
      updateActiveCommandFromRoot(state)
      
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        recalculateActiveCommandMetrics(active)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setTargetValue(state, action: PayloadAction<number>) {
      state.targetValue = action.payload
      updateActiveCommandFromRoot(state)
      
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        recalculateActiveCommandMetrics(active)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    autoFillTLS(state) {
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        active.selectedTLSs = selectTLSForVolume(active.milkReceivedVolume)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    toggleTLSSelection(state, action: PayloadAction<string>) {
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        const selected = active.selectedTLSs.includes(action.payload)
        if (selected) {
          active.selectedTLSs = active.selectedTLSs.filter((name) => name !== action.payload)
        } else {
          const currentCapacity = getSelectedTLSCapacity(active.selectedTLSs)
          if (currentCapacity >= active.milkReceivedVolume) return
          active.selectedTLSs = [...active.selectedTLSs, action.payload]
        }
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    toggleCuveSelection(state, action: PayloadAction<string>) {
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        const selected = active.selectedCFs.includes(action.payload)
        if (selected) {
          active.selectedCFs = active.selectedCFs.filter((name) => name !== action.payload)
        } else {
          const currentCapacity = getSelectedCFCapacity(active.selectedCFs)
          if (currentCapacity >= active.osmosedVolume) return
          active.selectedCFs = [...active.selectedCFs, action.payload]
        }
        initializeNewCFs(active)
        checkIfDispatched(active)
        active.status = active.selectedCFs.length > 0 ? "cuve" : active.status
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setCFDestination(state, action: PayloadAction<{ name: string; destination: "atia" | "grunwald" | "both" }>) {
      const { name, destination } = action.payload
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        if (!active.cfDestinations) active.cfDestinations = {}
        active.cfDestinations[name] = destination
        
        if (!active.cfSentStatus) active.cfSentStatus = {}
        if (!active.cfSentStatus[name]) {
          active.cfSentStatus[name] = { atia: false, grunwald: false }
        }
        checkIfDispatched(active)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setAllCFDestinations(state, action: PayloadAction<"atia" | "grunwald" | "both">) {
      const destination = action.payload
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        if (!active.cfDestinations) active.cfDestinations = {}
        const targets = active.selectedCFs.length > 0 ? active.selectedCFs : CF_TANKS.map(t => t.name)
        targets.forEach((name) => {
          active.cfDestinations[name] = destination
          if (!active.cfSentStatus) active.cfSentStatus = {}
          if (!active.cfSentStatus[name]) {
            active.cfSentStatus[name] = { atia: false, grunwald: false }
          }
        })
        checkIfDispatched(active)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    launchCFToMachine(state, action: PayloadAction<{ name: string; machine: "atia" | "grunwald" }>) {
      const { name, machine } = action.payload
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        if (!active.cfSentStatus) active.cfSentStatus = {}
        if (!active.cfSentStatus[name]) {
          active.cfSentStatus[name] = { atia: false, grunwald: false }
        }
        active.cfSentStatus[name][machine] = true
        checkIfDispatched(active)
        syncActiveCommandToRoot(state)
      }
    },
    setTLCVolume(state, action: PayloadAction<{ tank: keyof typeof state.tlcVolumes; volume: number }>) {
      state.tlcVolumes[action.payload.tank] = action.payload.volume
      state.simulationDone = false
    },
    setProductionStartTime(state, action: PayloadAction<string>) {
      state.productionStartTime = action.payload
      state.simulationDone = false
    },
    
    // Simulation controls
    startSimulation(state) {
      state.isSimulating = true
      state.simulationDone = false
      state.simulationProgress = 0
      state.simulationStepText = "Optimisation de l'overlap des commandes et calculs de conditionnement..."
    },
    updateSimulationProgress(state, action: PayloadAction<{ progress: number; stepText: string }>) {
      state.simulationProgress = action.payload.progress
      state.simulationStepText = action.payload.stepText
    },
    completeSimulation(state) {
      state.isSimulating = false
      state.simulationDone = true
      
      // Run the detailed timeline optimizer
      const results = runMultiCommandSimulation(state.commands, state.tlcVolumes)
      state.simulationResults = results
      
      // Keep root outputs in sync with active command or overall synthesis for backwards compatibility
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active && results.commandsResults[active.id]) {
        const ar = results.commandsResults[active.id]
        state.simulatedTiming = {
          transferTime: ar.transferEnd - ar.transferStart,
          osmoseTime: ar.osmoseEnd - ar.osmoseStart,
          powderTime: ar.powderEnd - ar.powderStart,
          pastoTime: ar.pastoEnd - ar.pastoStart,
          startTime: ar.transferStart,
          maturationTime: ar.maturationEnd - ar.maturationStart,
        }
      }
      state.simulatedTlcRemaining = results.tlcRemaining
      state.simulatedMilkReceivedVolume = state.commands.reduce((t, c) => t + c.milkReceivedVolume, 0)
      state.simulatedOsmosedVolume = state.commands.reduce((t, c) => t + c.osmosedVolume, 0)
    },
    resetOrder() {
      return initialState
    },
  },
})

export const {
  addCommand,
  deleteCommand,
  setActiveCommand,
  setOrderQty,
  setGramPerPot,
  setMilkReceptionValue,
  setTargetValue,
  autoFillTLS,
  toggleTLSSelection,
  toggleCuveSelection,
  setCFDestination,
  setAllCFDestinations,
  launchCFToMachine,
  setTLCVolume,
  setProductionStartTime,
  startSimulation,
  updateSimulationProgress,
  completeSimulation,
  resetOrder,
} = orderSlice.actions

export { CF_TANKS, TLS_TANKS, TLC_TANKS }
export default orderSlice.reducer
