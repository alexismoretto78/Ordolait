import { describe, it, expect, beforeEach } from 'vitest';
import orderReducer, {
  addCommand,
  updateCommandName,
  deleteCommand,
  setActiveCommand,
  setTargetValue,
  OrderState,
  getTLCStats,
  selectCuvesForVolume,
  computeRequiredRawMilk,
  computeOsmosedVolume,
  distributeToTLS,
  computeTransferTime,
  computeOsmoseTime,
  computePowderTime,
  computePastoTime,
  recalculateActiveCommandMetrics,
  runMultiCommandSimulation
} from './orderSlice';

describe('orderSlice reducer', () => {
  let initialState: OrderState;

  beforeEach(() => {
    // Generate an initial state using a dummy action to get the default state
    initialState = orderReducer(undefined, { type: 'unknown' });
  });

  it('should handle initial state', () => {
    expect(initialState).toBeDefined();
    expect(initialState.commands.length).toBeGreaterThan(0);
    expect(initialState.targetValue).toBe(41); 
  });

  it('should handle addCommand', () => {
    const initialCommandsCount = initialState.commands.length;
    const newState = orderReducer(initialState, addCommand({ name: "Cmd Test", startDate: "2024-01-01T10:00", expectedEndDate: "", references: [{ refName: "Test", potsQty: 1000, gramPerPot: 125 }] }));
    
    expect(newState.commands.length).toBe(initialCommandsCount + 1);
    const addedCommand = newState.commands[newState.commands.length - 1];
    expect(addedCommand.name).toBe("Cmd Test");
    // It should automatically set the new command as active
    expect(newState.activeCommandId).toBe(addedCommand.id);
  });

  it('should handle updateCommandName', () => {
    const firstCommandId = initialState.commands[0].id;
    const newName = 'Commande Spéciale';
    
    const newState = orderReducer(initialState, updateCommandName({ id: firstCommandId, name: newName }));
    const updatedCommand = newState.commands.find(c => c.id === firstCommandId);
    
    expect(updatedCommand?.name).toBe(newName);
    // Modifying command details sets simulationDone to false
    expect(newState.simulationDone).toBe(false);
  });

  it('should handle deleteCommand', () => {
    // First add a command to ensure we have at least 2
    const stateWithTwo = orderReducer(initialState, addCommand({ name: "Cmd Test", startDate: "2024-01-01T10:00", expectedEndDate: "", references: [{ refName: "Test", potsQty: 1000, gramPerPot: 125 }] }));
    const initialCount = stateWithTwo.commands.length;
    const commandToDelete = stateWithTwo.commands[stateWithTwo.commands.length - 1].id;
    
    const newState = orderReducer(stateWithTwo, deleteCommand(commandToDelete));
    
    expect(newState.commands.length).toBe(initialCount - 1);
    expect(newState.commands.find(c => c.id === commandToDelete)).toBeUndefined();
  });

  it('should handle setActiveCommand', () => {
    const stateWithTwo = orderReducer(initialState, addCommand({ name: "Cmd Test", startDate: "2024-01-01T10:00", expectedEndDate: "", references: [{ refName: "Test", potsQty: 1000, gramPerPot: 125 }] }));
    const firstCommandId = stateWithTwo.commands[0].id;
    const secondCommandId = stateWithTwo.commands[1].id;
    
    expect(stateWithTwo.activeCommandId).toBe(secondCommandId); // Because addCommand sets it
    
    const newState = orderReducer(stateWithTwo, setActiveCommand(firstCommandId));
    expect(newState.activeCommandId).toBe(firstCommandId);
  });

  it('should handle setTargetValue', () => {
    const newState = orderReducer(initialState, setTargetValue(35));
    expect(newState.targetValue).toBe(35);
    // Should invalidate simulation
    expect(newState.simulationDone).toBe(false);
  });
});

describe('orderSlice pure functions', () => {
  it('should compute TLC stats correctly', () => {
    const batches = [
      { id: '1', lotNumber: '1', volume: 10000, protein: 32, fat: 38, milkType: 'bio' as any, deliveryDate: Date.now() },
      { id: '2', lotNumber: '2', volume: 20000, protein: 34, fat: 40, milkType: 'bio' as any, deliveryDate: Date.now() }
    ];
    const stats = getTLCStats(batches);
    expect(stats.volume).toBe(30000);
    expect(stats.protein).toBeCloseTo(33.333, 3);
    expect(stats.fat).toBeCloseTo(39.333, 3);
  });

  it('should compute required raw milk', () => {
    expect(computeRequiredRawMilk(10000, 33, 41)).toBeCloseTo(12424.242, 3);
    expect(computeRequiredRawMilk(10000, 0, 41)).toBe(0);
  });

  it('should compute osmosed volume', () => {
    expect(computeOsmosedVolume(12424.242, 33, 41)).toBeCloseTo(10000, 0);
    expect(computeOsmosedVolume(10000, 0, 41)).toBe(0);
  });

  it('should compute transfer time', () => {
    expect(computeTransferTime(5200)).toBe(20);
    expect(computeTransferTime(10400)).toBe(40);
  });

  it('should compute osmose time', () => {
    expect(computeOsmoseTime(5200, 32, 40.96)).toBe(90);
  });

  it('should compute powder time', () => {
    expect(computePowderTime(4000)).toBe(25);
  });

  it('should compute pasto time', () => {
    expect(computePastoTime(5000)).toBe(60);
  });

  it('should distribute to TLS tanks', () => {
    expect(distributeToTLS(2000)).toEqual({ tls1: 0, tls2: 2000, tls3: 0 });
    expect(distributeToTLS(10000)).toEqual({ tls1: 0, tls2: 5200, tls3: 4800 });
    expect(distributeToTLS(12000)).toEqual({ tls1: 1600, tls2: 5200, tls3: 5200 });
    
    const alloc = distributeToTLS(10500);
    expect(alloc.tls1).toBe(1000);
    expect(alloc.tls2).toBe(5200);
    expect(alloc.tls3).toBe(4300);
  });

  it('selectCuvesForVolume should fallback when not enough available', () => {
    const resClassic = selectCuvesForVolume(1000, "bio", false);
    expect(resClassic.length).toBeGreaterThan(0);

    const resSkyr = selectCuvesForVolume(5000, "fcv3", true);
    expect(resSkyr).toEqual(["CF20"]);
  });
});

describe('orderSlice complex logic', () => {
  it('should recalculate active command metrics', () => {
    const mockCommand: any = {
      id: 'cmd-1',
      name: 'Test Cmd',
      references: [
        { id: 'ref-1', name: 'Nature 125g', potsQty: 10000, gramPerPot: 125 }
      ],
      whiteMassKg: 0,
      milkReceivedVolume: 0,
      milkReceptionValue: 0,
      targetValue: 41,
      tlsVolumes: { tls1: 0, tls2: 0, tls3: 0 },
      selectedTLSs: [],
      selectedCFs: [],
      cfDestinations: {},
      cfSentStatus: {},
      timing: { transferTime: 0, osmoseTime: 0, powderTime: 0, pastoTime: 0, startTime: 0, maturationTime: 0 },
      status: 'idle',
      osmosedVolume: 0,
      pasteurized: false,
      milkType: 'bio',
      isSkyr: false,
      skyrMilkType: 'fcv3',
      skyrDirectPasto: false,
      isCFManual: false,
    };

    const mockState: any = {
      tlcBatches: {
        tlc1: [{ id: 'b1', lotNumber: '1', volume: 10000, protein: 33, fat: 38, milkType: 'bio', deliveryDate: Date.now() }],
        tlc2: [], tlc3: [], tlc4: [], tankPermeat: []
      }
    };

    recalculateActiveCommandMetrics(mockState, mockCommand);

    expect(mockCommand.whiteMassKg).toBe(1250);
    expect(mockCommand.milkReceivedVolume).toBeCloseTo(1553.03, 1);
    expect(mockCommand.status).toBe('cuve');
  });

  it('should run multi command simulation', () => {
    const mockCommands: any[] = [
      {
        id: 'cmd-1',
        name: 'Sim Cmd',
        references: [{ id: 'ref-1', name: 'Nature 125g', potsQty: 10000, gramPerPot: 125 }],
        whiteMassKg: 1250,
        milkReceivedVolume: 1553.03,
        milkReceptionValue: 33,
        targetValue: 41,
        tlsVolumes: { tls1: 0, tls2: 1553.03, tls3: 0 },
        selectedTLSs: ['TLS2'],
        selectedCFs: ['CF1'],
        cfDestinations: { 'CF1': 'both' },
        cfSentStatus: { 'CF1': { atia: false, grunwald: false } },
        timing: { transferTime: 5.9, osmoseTime: 26.8, powderTime: 7.8, pastoTime: 15, startTime: 0, maturationTime: 360 },
        status: 'cuve',
        osmosedVolume: 1250,
        pasteurized: true,
        milkType: 'bio',
        isSkyr: false,
        skyrMilkType: 'fcv3',
        skyrDirectPasto: false,
        isCFManual: false,
      }
    ];

    const mockBatches: any = {
      tlc1: [{ id: 'b1', lotNumber: '1', volume: 10000, protein: 33, fat: 38, milkType: 'bio', deliveryDate: Date.now() }],
      tlc2: [], tlc3: [], tlc4: [], tankPermeat: []
    };

    const results = runMultiCommandSimulation(mockCommands, mockBatches);
    expect(results.ganttTasks.length).toBeGreaterThan(0);
    expect(results.commandsResults['cmd-1']).toBeDefined();
  });
});
