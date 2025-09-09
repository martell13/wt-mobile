// src/db.ts
import Dexie, { Table } from 'dexie';

export interface Gym {
  id: string;
  name: string;
  city?: string;
  notes?: string;
  createdAt: string; // ISO
}

export class WTDB extends Dexie {
  gyms!: Table<Gym, string>;

  constructor() {
    super('wtmobile'); // DB name in the browser
    this.version(1).stores({
      gyms: 'id, name, createdAt' // primary key: id
    });
  }
}

export const db = new WTDB();
