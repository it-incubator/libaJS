export class CacheGroup<T> {
    private cache: Map<string | number, T> = new Map();

    constructor() {}

    addItem(item: T, key?: string | number): void {
        const itemKey = key !== undefined ? key : this.cache.size;
        if (this.cache.has(itemKey)) {
            console.warn(`Warning: The key "${itemKey}" already exists in the group.`);
        }
        this.cache.set(itemKey, item);
    }

    getItem(key?: string | number): T | undefined {
        if (key !== undefined) {
            return this.cache.get(key);
        }
        return this.cache.values().next().value;
    }

    *[Symbol.iterator](): IterableIterator<T> {
        for (let item of this.cache.values()) {
            yield item;
        }
    }
}

export class CacheManager<T> {
    private groups: Map<any, CacheGroup<T>> = new Map();

    addItem(item: T, type: any, key?: string | number): void {
        let currentGroup = this.groups.get(type);

        if (!currentGroup) {
            currentGroup = new CacheGroup<T>();
            this.groups.set(type, currentGroup);
        }

        currentGroup.addItem(item, key);
    }

    getItem(type: any, key?: string | number): T | undefined {
        const currentGroup = this.groups.get(type);
        return currentGroup ? currentGroup.getItem(key) : undefined;
    }

    *[Symbol.iterator](): IterableIterator<T> {
        for (const group of this.groups.values()) {
            yield* group;
        }
    }
}
