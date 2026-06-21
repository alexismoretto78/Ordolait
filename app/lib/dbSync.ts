import { Command, Batch } from './orderSlice';

export async function saveCompletedCommand(cmd: Command) {
  try {
    const response = await fetch('/api/commands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: cmd.name,
        status: cmd.status,
        whiteMassKg: cmd.whiteMassKg,
        milkReceivedVolume: cmd.milkReceivedVolume,
        targetValue: cmd.targetValue,
        osmosedVolume: cmd.osmosedVolume,
        milkType: cmd.milkType,
        isSkyr: cmd.isSkyr,
        references: cmd.references.map(r => ({
          name: r.name,
          potsQty: r.potsQty,
          gramPerPot: r.gramPerPot
        }))
      }),
    });
    if (!response.ok) {
      console.error('Failed to save command to DB');
    }
  } catch (err) {
    console.error('Error saving command to DB:', err);
  }
}

export async function saveCompletedReception(batch: Omit<Batch, "id"> & { milkType: string }) {
  try {
    const response = await fetch('/api/receptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lotNumber: batch.lotNumber,
        volume: batch.volume,
        protein: batch.protein,
        fat: batch.fat,
        milkType: batch.milkType,
        deliveryDate: new Date(batch.deliveryDate).toISOString()
      }),
    });
    if (!response.ok) {
      console.error('Failed to save reception to DB');
    }
  } catch (err) {
    console.error('Error saving reception to DB:', err);
  }
}

export async function fetchCompletedCommands() {
  const response = await fetch('/api/commands');
  if (!response.ok) throw new Error('Failed to fetch commands');
  return response.json();
}

export async function fetchCompletedReceptions() {
  const response = await fetch('/api/receptions');
  if (!response.ok) throw new Error('Failed to fetch receptions');
  return response.json();
}
