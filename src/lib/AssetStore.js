const DATABASE_NAME = 'catzz_assets';
const STORE_NAME = 'assets';

export class AssetStore {
  constructor() { this.databasePromise = null; }

  open() {
    if (this.databasePromise) return this.databasePromise;
    this.databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.databasePromise;
  }

  async get(key) {
    const database = await this.open();
    return requestResult(database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key));
  }

  async set(key, value) {
    const database = await this.open();
    return requestResult(database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(value, key));
  }

  async delete(key) {
    const database = await this.open();
    return requestResult(database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(key));
  }

  async clear() {
    const database = await this.open();
    return requestResult(database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).clear());
  }
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
