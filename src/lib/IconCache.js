/**
 * IndexedDB-based Icon Cache for Persistent Storage
 * Caches icon data to avoid repeated network requests and 404 errors
 */
export class IconCache {
    constructor() {
        this.dbName = 'CatzzIconCache';
        this.storeName = 'icons';
        this.version = 1;
        this.db = null;
        this.memoryCache = new Map(); // L1 cache for ultra-fast access
    }

    /**
     * Initialize IndexedDB
     */
    async init() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'url' });
                    store.createIndex('cachedAt', 'cachedAt', { unique: false });
                }
            };
        });
    }

    /**
     * Get cached icon data
     * @param {string} url - The bookmark URL
     * @returns {Promise<object|null>} Cached icon data or null
     */
    async get(url) {
        // L1: Memory cache
        if (this.memoryCache.has(url)) {
            return this.memoryCache.get(url);
        }

        // L2: IndexedDB
        try {
            await this.init();
            const tx = this.db.transaction(this.storeName, 'readonly');
            const store = tx.objectStore(this.storeName);
            const request = store.get(url);

            return new Promise((resolve) => {
                request.onsuccess = () => {
                    const data = request.result;
                    if (data && this.isValid(data)) {
                        // Restore to memory cache
                        this.memoryCache.set(url, data);
                        resolve(data);
                    } else if (data) {
                        // Expired, delete it
                        this.delete(url);
                        resolve(null);
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => resolve(null);
            });
        } catch (e) {
            return null;
        }
    }

    /**
     * Save icon data to cache
     * @param {string} url - The bookmark URL
     * @param {object} data - Icon data {iconSrc, iconType, textFallback}
     */
    async set(url, data) {
        const cacheData = {
            url,
            ...data,
            cachedAt: Date.now(),
            expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        // L1: Memory cache
        this.memoryCache.set(url, cacheData);

        // L2: IndexedDB
        try {
            await this.init();
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            store.put(cacheData);
        } catch (e) {
            // Fallback: use memory cache only
        }
    }

    /**
     * Check if cached data is still valid
     */
    isValid(data) {
        if (!data.cachedAt || !data.expiresIn) return false;
        return Date.now() - data.cachedAt < data.expiresIn;
    }

    /**
     * Delete expired or invalid cache entry
     */
    async delete(url) {
        this.memoryCache.delete(url);
        try {
            await this.init();
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            store.delete(url);
        } catch (e) {
            // Ignore errors
        }
    }

    /**
     * Clear all cache (both memory and IndexedDB)
     */
    async clear() {
        this.memoryCache.clear();
        try {
            await this.init();
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            store.clear();
        } catch (e) {
            // Ignore errors
        }
    }

    /**
     * Clean up expired entries (maintenance task)
     */
    async cleanup() {
        try {
            await this.init();
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            const request = store.openCursor();

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (!this.isValid(cursor.value)) {
                        cursor.delete();
                    }
                    cursor.continue();
                }
            };
        } catch (e) {
            // Ignore errors
        }
    }
}
