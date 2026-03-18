export interface Services<T> {
    getAll(): T[];
    add(item: T): void;
    remove(id: string): void;
    modify(id: string, mod: Partial<T>): boolean;
}