/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDBPDatabase } from 'idb';
import merge from 'lodash.merge';
import { StandardToken, StoreName } from 'src/global';

export class ObjectStorage<T = any> {
  public readonly storeName: StoreName;
  public readonly db: IDBPDatabase<unknown>;

  constructor(db: IDBPDatabase<unknown>, storeName: StoreName) {
    this.db = db;
    this.storeName = storeName;
  }

  async get(key: string): Promise<T | undefined> {
    const data = await this.db.get(this.storeName, key);
    return data as T;
  }

  async getAll(): Promise<Array<T>> {
    const data = await this.db.getAll(this.storeName);
    return data as Array<T>;
  }

  async put(key: string, value: T) {
    await this.db.put(this.storeName, value, key);
  }

  async upsert(key: string, value: Partial<T>) {
    const data = await this.get(key);
    const finalData = data ? merge(data, value) : (value as T);
    await this.put(key, finalData);
  }

  async del(key: string) {
    await this.db.delete(this.storeName, key);
  }
}

export default class IndexedStorage {
  public readonly databaseName: string;
  public readonly db: IDBPDatabase<unknown>;

  public readonly token: ObjectStorage<Array<StandardToken>>;

  constructor(db: IDBPDatabase<unknown>, databaseName: string) {
    this.db = db;
    this.databaseName = databaseName;

    this.token = new ObjectStorage<Array<StandardToken>>(db, 'tokens');
  }
}
