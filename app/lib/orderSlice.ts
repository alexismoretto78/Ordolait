import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type TimingInfo = {
  transferTime: number // minutes TLC->TLS
  osmoseTime: number // minutes
  powderTime: number // minutes
  pastoTime: number // minutes
  startTime: number // timestamp
  maturationTime: number // minutes (maturation in cuves)
}

export type Batch = {
  id: string
  lotNumber: string // aammjjhhmm
  volume: number // L
  protein: number // g/L (matière protéique)
  fat: number // g/L (matière grasse)
  milkType: MilkType
}

export type ProductReference = {
  id: string
  name: string
  potsQty: number
  gramPerPot: number
}

export type Command = {
  id: string
  name: string
  references: ProductReference[]
  whiteMassKg: number
  milkReceivedVolume: number
  milkReceptionValue: number // Ci - calculated dynamically from TLC batches used
  targetValue: number // Cf - target protein level after osmosis
  tlsVolumes: { tls1: number; tls2: number; tls3: number }
  selectedTLSs: string[]
  selectedCFs: string[]
  cfDestinations: { [tankName: string]: "atia" | "grunwald" | "both" }
  cfSentStatus: { [tankName: string]: { atia: boolean; grunwald: boolean } }
  refDestinations: { [refId: string]: "atia" | "grunwald" | "both" }
  refSentStatus: { [refId: string]: { atia: boolean; grunwald: boolean } }
  refPotsLaunched: { [refId: string]: { atia?: number; grunwald?: number } }
  timing: TimingInfo
  status: "idle" | "order" | "osmosis" | "pasto" | "cuve" | "dispatched"
  osmosedVolume: number
  pasteurized: boolean
  milkType: MilkType
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

export type GanttSegment = {
  startMinute: number
  durationMinutes: number
  color: string
  label?: string
}

export type GanttTask = {
  key: string
  label: string
  startMinute: number
  durationMinutes: number
  color: string
  segments?: GanttSegment[]
}

export type MultiCommandSimResults = {
  totalDurationMinutes: number
  commandsResults: { [id: string]: CommandSimResult }
  tlcRemainingBatches: {
    tlc1: Batch[]
    tlc2: Batch[]
    tlc3: Batch[]
    tlc4: Batch[]
  }
  ganttTasks: GanttTask[]
}

export type MilkType = "bio" | "fcv3" | "savoie" | "montagne"

export type OrderState = {
  // Backwards compatibility root fallbacks
  orderQty: number
  gramPerPot: number
  whiteMassKg: number
  milkReceivedVolume: number
  milkReceptionValue: number
  targetValue: number
  tlsVolumes: { tls1: number; tls2: number; tls3: number }
  tlcVolumes: { tlc1: number; tlc2: number; tlc3: number; tlc4: number }
  tlcRemaining: { tlc1: number; tlc2: number; tlc3: number; tlc4: number }
  tlcMilkTypes: { tlc1: MilkType; tlc2: MilkType; tlc3: MilkType; tlc4: MilkType }
  milkType: MilkType
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
  
  // TLC Batches State
  tlcBatches: {
    tlc1: Batch[]
    tlc2: Batch[]
    tlc3: Batch[]
    tlc4: Batch[]
  }
  
  // Simulation status fields
  isSimulating: boolean
  simulationDone: boolean
  simulationProgress: number
  simulationStepText: string
  
  // Results
  simulatedTiming: TimingInfo
  simulatedMilkReceivedVolume: number
  simulatedOsmosedVolume: number

  // Multi-command states
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

  const references: ProductReference[] = [
    { id: "ref-1", name: "Nature 125g", potsQty: 80000, gramPerPot: 125 },
    { id: "ref-2", name: "Fraise 120g", potsQty: 40000, gramPerPot: 120 },
  ]

  const refDestinations: { [refId: string]: "atia" | "grunwald" | "both" } = {
    "ref-1": "both",
    "ref-2": "both",
  }

  const refSentStatus: { [refId: string]: { atia: boolean; grunwald: boolean } } = {
    "ref-1": { atia: false, grunwald: false },
    "ref-2": { atia: false, grunwald: false },
  }

  const refPotsLaunched: { [refId: string]: { atia?: number; grunwald?: number } } = {
    "ref-1": {},
    "ref-2": {},
  }

  return {
    id,
    name,
    references,
    refDestinations,
    refSentStatus,
    refPotsLaunched,
    whiteMassKg: 14800, // 80000 * 0.125 + 40000 * 0.12 = 10000 + 4800 = 14800
    milkReceivedVolume: 18385.366,
    milkReceptionValue: 33,
    targetValue: 41,
    tlsVolumes: { tls1: 11000, tls2: 5200, tls3: 2185.366 },
    selectedTLSs: ["TLS1", "TLS2", "TLS3"],
    selectedCFs,
    cfDestinations,
    cfSentStatus,
    timing: { transferTime: 70.7, osmoseTime: 318.2, powderTime: 111, pastoTime: 177.6, startTime: 0, maturationTime: 360 },
    status: "cuve",
    osmosedVolume: 14800,
    pasteurized: true,
    milkType: "bio",
  }
}

const initialBatches = () => ({
  tlc1: [
    { id: "batch-1", lotNumber: "2605291200", volume: 30000, protein: 33, fat: 38, milkType: "bio" as MilkType }
  ],
  tlc2: [
    { id: "batch-2", lotNumber: "2605291300", volume: 30000, protein: 34, fat: 39, milkType: "fcv3" as MilkType }
  ],
  tlc3: [
    { id: "batch-3", lotNumber: "2605291400", volume: 30000, protein: 32, fat: 37, milkType: "savoie" as MilkType }
  ],
  tlc4: [
    { id: "batch-4", lotNumber: "2605291500", volume: 30000, protein: 35, fat: 40, milkType: "montagne" as MilkType }
  ]
})

const initialState: OrderState = {
  orderQty: 120000,
  gramPerPot: 120,
  whiteMassKg: 14800,
  milkReceivedVolume: 18385.366,
  milkReceptionValue: 33,
  targetValue: 41,
  tlsVolumes: { tls1: 11000, tls2: 5200, tls3: 2185.366 },
  tlcVolumes: { tlc1: 30000, tlc2: 30000, tlc3: 30000, tlc4: 30000 },
  tlcRemaining: { tlc1: 30000, tlc2: 30000, tlc3: 30000, tlc4: 30000 },
  tlcMilkTypes: { tlc1: "bio", tlc2: "fcv3", tlc3: "savoie", tlc4: "montagne" },
  milkType: "bio",
  osmosedVolume: 14800,
  pasteurized: true,
  selectedCFs: ["CF4", "CF5", "CF1", "CF2", "CF3", "CF11", "CF12", "CF13", "CF14", "CF15"],
  selectedTLSs: ["TLS1", "TLS2", "TLS3"],
  sentAtia: false,
  sentGrunwald: false,
  timing: { transferTime: 70.7, osmoseTime: 318.2, powderTime: 111, pastoTime: 177.6, startTime: 0, maturationTime: 360 },
  status: "cuve",
  cfDestinations: {},
  cfSentStatus: {},
  productionStartTime: "",
  
  tlcBatches: initialBatches(),
  
  isSimulating: false,
  simulationDone: false,
  simulationProgress: 0,
  simulationStepText: "",
  simulatedTiming: { transferTime: 70.7, osmoseTime: 318.2, powderTime: 111, pastoTime: 177.6, startTime: 0, maturationTime: 360 },
  simulatedMilkReceivedVolume: 0,
  simulatedOsmosedVolume: 0,

  // Start with one default command
  commands: [initialCommand("cmd-1", "Commande 1")],
  activeCommandId: "cmd-1",
}

export const getTLCStats = (batches: Batch[]) => {
  if (batches.length === 0) {
    return { volume: 0, protein: 0, fat: 0 }
  }
  const volume = batches.reduce((sum, b) => sum + b.volume, 0)
  const protein = batches.reduce((sum, b) => sum + b.volume * b.protein, 0) / volume
  const fat = batches.reduce((sum, b) => sum + b.volume * b.fat, 0) / volume
  return { volume, protein: Number(protein.toFixed(3)), fat: Number(fat.toFixed(3)) }
}

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
  if (command.references.length === 0) return

  let allDone = true

  command.references.forEach((ref) => {
    const dest = command.refDestinations?.[ref.id] || "both"
    const sent = command.refSentStatus?.[ref.id] || { atia: false, grunwald: false }

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
    const totalPots = active.references.reduce((sum, r) => sum + r.potsQty, 0)
    state.orderQty = totalPots
    state.gramPerPot = totalPots > 0 ? active.references.reduce((sum, r) => sum + r.potsQty * r.gramPerPot, 0) / totalPots : 120
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
    state.milkType = active.milkType as MilkType

    // Update tlcVolumes derived from tlcBatches
    const keys: (keyof typeof state.tlcVolumes)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
    keys.forEach(k => {
      const stats = getTLCStats(state.tlcBatches[k])
      state.tlcVolumes[k] = stats.volume
    })
  }
}

const updateActiveCommandFromRoot = (state: OrderState) => {
  const activeIdx = state.commands.findIndex(c => c.id === state.activeCommandId)
  if (activeIdx !== -1) {
    state.commands[activeIdx] = {
      ...state.commands[activeIdx],
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
      milkType: state.milkType,
    }
  }
}

const recalculateActiveCommandMetrics = (state: OrderState, active: Command) => {
  // 1. Calculate total white mass from product references
  active.whiteMassKg = active.references.reduce((sum, r) => sum + (r.potsQty * r.gramPerPot) / 1000, 0)
  active.status = active.references.length > 0 ? "order" : "idle"

  // 2. Fetch protein levels from TLC batches of target milkType
  const requiredType = active.milkType || "bio"
  let totalVol = 0
  let totalProtWeight = 0
  const keys: (keyof typeof state.tlcBatches)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
  keys.forEach(k => {
    state.tlcBatches[k].forEach(b => {
      if (b.milkType === requiredType) {
        totalVol += b.volume
        totalProtWeight += b.volume * b.protein
      }
    })
  })
  const avgProtein = totalVol > 0 ? totalProtWeight / totalVol : 33.0
  active.milkReceptionValue = Number(avgProtein.toFixed(3))

  if (active.whiteMassKg > 0 && active.milkReceptionValue > 0 && active.targetValue > 0) {
    active.milkReceivedVolume = computeRequiredRawMilk(
      active.whiteMassKg,
      active.milkReceptionValue,
      active.targetValue
    )
    active.tlsVolumes = distributeToTLS(active.milkReceivedVolume)
    active.selectedTLSs = selectTLSForVolume(active.milkReceivedVolume)
  } else {
    active.milkReceivedVolume = 0
    active.tlsVolumes = { tls1: 0, tls2: 0, tls3: 0 }
    active.selectedTLSs = []
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
  } else {
    active.pasteurized = false
    active.selectedCFs = []
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
  milkType: MilkType
}

// Global simulation executor
export const runMultiCommandSimulation = (
  commands: Command[],
  tlcBatchesInitial: { tlc1: Batch[]; tlc2: Batch[]; tlc3: Batch[]; tlc4: Batch[] }
): MultiCommandSimResults => {
  let timeOsmosisFree = 0
  let timePowderFree = 0
  let timePastoFree = 0
  let timeGrunwald = 0
  let timeAtia = 0
  
  // Clone TLC batches to consume them during simulation
  const tlcBatches = {
    tlc1: tlcBatchesInitial.tlc1.map(b => ({ ...b })),
    tlc2: tlcBatchesInitial.tlc2.map(b => ({ ...b })),
    tlc3: tlcBatchesInitial.tlc3.map(b => ({ ...b })),
    tlc4: tlcBatchesInitial.tlc4.map(b => ({ ...b })),
  }
  
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
        // Calculate the dynamic protein for this volume of drawn milk
        let remainingToDraw = vol
        const requiredType = cmd.milkType || "bio"
        let totalProtDrawn = 0
        let actualDrawn = 0

        const tlcKeys: (keyof typeof tlcBatches)[] = ["tlc1", "tlc2", "tlc3", "tlc4"]
        for (const k of tlcKeys) {
          if (remainingToDraw <= 0) break
          const batches = tlcBatches[k]
          for (let i = 0; i < batches.length; i++) {
            if (remainingToDraw <= 0) break
            const b = batches[i]
            if (b.milkType === requiredType && b.volume > 0) {
              const draw = Math.min(b.volume, remainingToDraw)
              b.volume = Number((b.volume - draw).toFixed(3))
              remainingToDraw = Number((remainingToDraw - draw).toFixed(3))
              totalProtDrawn += draw * b.protein
              actualDrawn += draw
            }
          }
          tlcBatches[k] = batches.filter(b => b.volume > 0)
        }

        const tlsDrawnProtein = actualDrawn > 0 ? totalProtDrawn / actualDrawn : cmd.milkReceptionValue
        const osmVol = computeOsmosedVolume(vol, tlsDrawnProtein, cmd.targetValue)
        
        tlsList.push({
          commandId: cmd.id,
          commandIdx: cmdIdx,
          commandName: cmd.name,
          tlsKey: key,
          rawVolume: vol,
          osmosedVolume: osmVol,
          milkType: requiredType,
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
    
    // 1. Schedule Transfer TLC -> TLS
    const transferStart = tlsAvailableAt[TLS_NAME]
    const transferDuration = computeTransferTime(tlsItem.rawVolume)
    const transferEnd = transferStart + transferDuration

    if (cmdTransStart[tlsItem.commandId] === undefined) {
      cmdTransStart[tlsItem.commandId] = transferStart
    }
    cmdTransEnd[tlsItem.commandId] = transferEnd

    // 2. Schedule Osmosis
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

    // 3. Schedule Powdering & Pasteurization
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

    const powderDuration = computePowderTime(tlsItem.osmosedVolume)
    const pastoDuration = computePastoTime(tlsItem.osmosedVolume)

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

    timePowderFree = pastoStart
    timePastoFree = pastoEnd
    tlsAvailableAt[TLS_NAME] = pastoEnd

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

    // 4. Schedule Maturation
    const maturationStart = pastoEnd
    const maturationEnd = pastoEnd + 360

    ganttTasks.push({
      key: `${tlsItem.commandId}-${TLS_NAME}-maturation`,
      label: `${tlsItem.commandName} : Maturation ${TLS_NAME}`,
      startMinute: maturationStart,
      durationMinutes: 360,
      color: getCommandColor(tlsItem.commandIdx, "maturation"),
    })

    if (cmdMinStart[tlsItem.commandId] === undefined) {
      cmdMinStart[tlsItem.commandId] = transferStart
    }
  })

  // Finalize command results timelines with intermediate states
  commands.forEach(cmd => {
    if (cmd.references.length === 0) return

    const tStart = cmdMinStart[cmd.id] || 0
    const tEndMaturation = (cmdPastoEnd[cmd.id] || 0) + 360

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
      maturationEnd: tEndMaturation,
      packagingStart: tEndMaturation,
      packagingEnd: tEndMaturation,
      packagingAtiaDuration: 0,
      packagingGrunDuration: 0,
      totalDuration: tEndMaturation,
    }
  })

  // 5. Schedule Reference Packaging sequentially per command after maturation is complete
  commands.forEach((cmd, cmdIdx) => {
    const cmdRes = commandsResults[cmd.id]
    if (!cmdRes) return
    const packagingStart = cmdRes.maturationEnd

    cmd.references.forEach((ref) => {
      const dest = cmd.refDestinations?.[ref.id] || "both"
      const customPots = cmd.refPotsLaunched?.[ref.id]
      const potsDefault = ref.potsQty

      let potsAtia = 0
      let potsGrun = 0

      if (dest === "atia") {
        potsAtia = customPots?.atia !== undefined ? customPots.atia : potsDefault
      } else if (dest === "grunwald") {
        potsGrun = customPots?.grunwald !== undefined ? customPots.grunwald : potsDefault
      } else { // both
        potsAtia = customPots?.atia !== undefined ? customPots.atia : potsDefault * (3500 / 13500)
        potsGrun = customPots?.grunwald !== undefined ? customPots.grunwald : potsDefault * (10000 / 13500)
      }

      let pkgStart = 0
      let pkgDuration = 0
      let emptyTime = 0

      if (dest === "grunwald") {
        pkgStart = Math.max(packagingStart, timeGrunwald)
        pkgDuration = (potsGrun / 10000) * 60
        emptyTime = pkgStart + pkgDuration
        timeGrunwald = emptyTime

        ganttTasks.push({
          key: `${cmd.id}-${ref.id}-pkg-grun`,
          label: `${cmd.name} : Cond. ${ref.name} (GRUN)`,
          startMinute: pkgStart,
          durationMinutes: pkgDuration,
          color: getCommandColor(cmdIdx, "packaging_grun"),
        })
      } else if (dest === "atia") {
        pkgStart = Math.max(packagingStart, timeAtia)
        pkgDuration = (potsAtia / 3500) * 60
        emptyTime = pkgStart + pkgDuration
        timeAtia = emptyTime

        ganttTasks.push({
          key: `${cmd.id}-${ref.id}-pkg-atia`,
          label: `${cmd.name} : Cond. ${ref.name} (ATIA)`,
          startMinute: pkgStart,
          durationMinutes: pkgDuration,
          color: getCommandColor(cmdIdx, "packaging_atia"),
        })
      } else { // both
        const atiaStart = Math.max(packagingStart, timeAtia)
        const grunStart = Math.max(packagingStart, timeGrunwald)
        
        const atiaDuration = (potsAtia / 3500) * 60
        const grunDuration = (potsGrun / 10000) * 60
        
        const atiaEnd = atiaStart + atiaDuration
        const grunEnd = grunStart + grunDuration
        
        timeAtia = atiaEnd
        timeGrunwald = grunEnd
        pkgStart = Math.min(atiaStart, grunStart)
        emptyTime = Math.max(atiaEnd, grunEnd)

        ganttTasks.push({
          key: `${cmd.id}-${ref.id}-pkg-both`,
          label: `${cmd.name} : Cond. ${ref.name} (ATIA+GRUN)`,
          startMinute: pkgStart,
          durationMinutes: emptyTime - pkgStart,
          color: getCommandColor(cmdIdx, "packaging_grun"),
        })
      }

      if (cmdMaxEnd[cmd.id] === undefined || emptyTime > cmdMaxEnd[cmd.id]) {
        cmdMaxEnd[cmd.id] = emptyTime
      }
    })

    // Group CF tank washing tasks at the end of reference packaging
    const cmdPkgEnd = cmdMaxEnd[cmd.id] || cmdRes.maturationEnd
    cmdRes.packagingEnd = cmdPkgEnd
    cmdRes.totalDuration = cmdPkgEnd

    const selectedCFs = commandCFSelectedList[cmd.id]
    selectedCFs.forEach(cfName => {
      ganttTasks.push({
        key: `${cmd.id}-${cfName}-wash`,
        label: `${cmd.name} : Lavage ${cfName}`,
        startMinute: cmdPkgEnd,
        durationMinutes: 30,
        color: "#cbd5e1",
      })
      cfAvailableAt[cfName] = cmdPkgEnd + 30
    })
  })

  const totalDurationMinutes = Math.max(
    timeGrunwald,
    timeAtia,
    timePastoFree,
    ...Object.values(cfAvailableAt),
    ...Object.values(tlsAvailableAt)
  )

  // Post-process ganttTasks to group washings and packaging rows compactly
  const finalGanttTasks: GanttTask[] = []
  ganttTasks.forEach(task => {
    if (!task.key.includes("-pkg-") && !task.key.endsWith("-wash")) {
      finalGanttTasks.push(task)
    }
  })

  // Group Packaging by Command
  commands.forEach((cmd, cmdIdx) => {
    const pkgTasks = ganttTasks.filter(t => t.key.startsWith(`${cmd.id}-`) && t.key.includes("-pkg-"))
    if (pkgTasks.length > 0) {
      const startMin = Math.min(...pkgTasks.map(t => t.startMinute))
      const endMax = Math.max(...pkgTasks.map(t => t.startMinute + t.durationMinutes))
      const duration = endMax - startMin

      const destinations = new Set<string>()
      pkgTasks.forEach(t => {
        if (t.key.endsWith("-pkg-grun")) destinations.add("GRUN")
        else if (t.key.endsWith("-pkg-atia")) destinations.add("ATIA")
        else if (t.key.endsWith("-pkg-both")) {
          destinations.add("ATIA")
          destinations.add("GRUN")
        }
      })
      const machineLabel = Array.from(destinations).sort().join(" + ") || "ATIA + GRUN"

      finalGanttTasks.push({
        key: `${cmd.id}-pkg-combined`,
        label: `${cmd.name} : Conditionnement (${machineLabel})`,
        startMinute: startMin,
        durationMinutes: duration,
        color: getCommandColor(cmdIdx, destinations.has("GRUN") ? "packaging_grun" : "packaging_atia"),
      })
    }
  })

  // Group Washing tasks in a single global row
  const allWashTasks = ganttTasks.filter(t => t.key.endsWith("-wash"))
  if (allWashTasks.length > 0) {
    const segments = allWashTasks.map(t => ({
      startMinute: t.startMinute,
      durationMinutes: t.durationMinutes,
      color: t.color,
      label: t.label,
    }))

    const startMin = Math.min(...allWashTasks.map(t => t.startMinute))
    const endMax = Math.max(...allWashTasks.map(t => t.startMinute + t.durationMinutes))

    finalGanttTasks.push({
      key: "global-cf-wash",
      label: "Lavage des Cuves CF",
      startMinute: startMin,
      durationMinutes: endMax - startMin,
      color: "#cbd5e1",
      segments,
    })
  }

  return {
    totalDurationMinutes,
    commandsResults,
    tlcRemainingBatches: tlcBatches,
    ganttTasks: finalGanttTasks,
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
    setCommandMilkType(state, action: PayloadAction<{ id: string; milkType: MilkType }>) {
      const { id, milkType } = action.payload
      const cmd = state.commands.find(c => c.id === id)
      if (cmd) {
        cmd.milkType = milkType
        recalculateActiveCommandMetrics(state, cmd)
        if (state.activeCommandId === id) {
          state.milkType = milkType
        }
      }
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },
    
    // Product Reference Reducers
    addReference(state, action: PayloadAction<{ cmdId: string }>) {
      const { cmdId } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        const nextId = `ref-${Date.now()}`
        cmd.references.push({
          id: nextId,
          name: `Réf ${cmd.references.length + 1}`,
          potsQty: 20000,
          gramPerPot: 120
        })
        cmd.refDestinations[nextId] = "both"
        cmd.refSentStatus[nextId] = { atia: false, grunwald: false }
        cmd.refPotsLaunched[nextId] = {}
        recalculateActiveCommandMetrics(state, cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    updateReference(
      state,
      action: PayloadAction<{ cmdId: string; refId: string; fields: Partial<ProductReference> }>
    ) {
      const { cmdId, refId, fields } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        const ref = cmd.references.find(r => r.id === refId)
        if (ref) {
          Object.assign(ref, fields)
          recalculateActiveCommandMetrics(state, cmd)
          syncActiveCommandToRoot(state)
        }
      }
      state.simulationDone = false
    },
    deleteReference(state, action: PayloadAction<{ cmdId: string; refId: string }>) {
      const { cmdId, refId } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd && cmd.references.length > 1) {
        cmd.references = cmd.references.filter(r => r.id !== refId)
        delete cmd.refDestinations[refId]
        delete cmd.refSentStatus[refId]
        delete cmd.refPotsLaunched[refId]
        recalculateActiveCommandMetrics(state, cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },

    // Reference packaging destination and launch controllers
    setRefDestination(state, action: PayloadAction<{ cmdId: string; refId: string; destination: "atia" | "grunwald" | "both" }>) {
      const { cmdId, refId, destination } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        if (!cmd.refDestinations) cmd.refDestinations = {}
        cmd.refDestinations[refId] = destination
        
        if (!cmd.refSentStatus) cmd.refSentStatus = {}
        if (!cmd.refSentStatus[refId]) {
          cmd.refSentStatus[refId] = { atia: false, grunwald: false }
        }
        checkIfDispatched(cmd)
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    setRefPotsLaunched(state, action: PayloadAction<{ cmdId: string; refId: string; atia?: number; grunwald?: number }>) {
      const { cmdId, refId, atia, grunwald } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        if (!cmd.refPotsLaunched) cmd.refPotsLaunched = {}
        if (!cmd.refPotsLaunched[refId]) cmd.refPotsLaunched[refId] = {}
        if (atia !== undefined) cmd.refPotsLaunched[refId].atia = atia
        if (grunwald !== undefined) cmd.refPotsLaunched[refId].grunwald = grunwald
        syncActiveCommandToRoot(state)
      }
      state.simulationDone = false
    },
    launchRefToMachine(state, action: PayloadAction<{ cmdId: string; refId: string; machine: "atia" | "grunwald" }>) {
      const { cmdId, refId, machine } = action.payload
      const cmd = state.commands.find(c => c.id === cmdId)
      if (cmd) {
        if (!cmd.refSentStatus) cmd.refSentStatus = {}
        if (!cmd.refSentStatus[refId]) {
          cmd.refSentStatus[refId] = { atia: false, grunwald: false }
        }
        cmd.refSentStatus[refId][machine] = true
        checkIfDispatched(cmd)
        syncActiveCommandToRoot(state)
      }
    },
    
    // TLC Batch Reducers
    addBatch(state, action: PayloadAction<{ tank: "tlc1" | "tlc2" | "tlc3" | "tlc4"; batch: Omit<Batch, "id"> }>) {
      const { tank, batch } = action.payload
      const nextId = `batch-${Date.now()}`
      
      // Enforce raw milk mixture rule: must have the same milkType as current batches, if not empty
      const currentType = state.tlcBatches[tank].length > 0 ? state.tlcBatches[tank][0].milkType : null
      if (currentType && currentType !== batch.milkType) {
        return // mix violation
      }

      state.tlcBatches[tank].push({
        id: nextId,
        ...batch
      })
      
      // Recalculate metrics for all commands because raw milk properties changed
      state.commands.forEach(cmd => recalculateActiveCommandMetrics(state, cmd))
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },
    deleteBatch(state, action: PayloadAction<{ tank: "tlc1" | "tlc2" | "tlc3" | "tlc4"; batchId: string }>) {
      const { tank, batchId } = action.payload
      state.tlcBatches[tank] = state.tlcBatches[tank].filter(b => b.id !== batchId)
      
      // Recalculate metrics for all commands
      state.commands.forEach(cmd => recalculateActiveCommandMetrics(state, cmd))
      syncActiveCommandToRoot(state)
      state.simulationDone = false
    },

    setTargetValue(state, action: PayloadAction<number>) {
      state.targetValue = action.payload
      updateActiveCommandFromRoot(state)
      
      const active = state.commands.find(c => c.id === state.activeCommandId)
      if (active) {
        recalculateActiveCommandMetrics(state, active)
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
      
      const results = runMultiCommandSimulation(state.commands, state.tlcBatches)
      state.simulationResults = results
      
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
  setCommandMilkType,
  addReference,
  updateReference,
  deleteReference,
  setRefDestination,
  setRefPotsLaunched,
  launchRefToMachine,
  addBatch,
  deleteBatch,
  setTargetValue,
  autoFillTLS,
  toggleTLSSelection,
  toggleCuveSelection,
  setProductionStartTime,
  startSimulation,
  updateSimulationProgress,
  completeSimulation,
  resetOrder,
} = orderSlice.actions

export { CF_TANKS, TLS_TANKS, TLC_TANKS }
export default orderSlice.reducer
