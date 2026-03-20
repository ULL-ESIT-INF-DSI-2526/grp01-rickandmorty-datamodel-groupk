/**
 * Interfaz genérica para los servicios de personajes, localizaciones y episodios
 */
export interface Services<T> {
    getAll(): Promise<T[]>;
    add(item: T): Promise<void>;
    remove(id: string): Promise<void>;
    modify(id: string, mod: Partial<T>): Promise<boolean>;
}