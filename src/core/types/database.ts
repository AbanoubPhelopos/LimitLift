export interface Migration {
    name: string;
    up: (db: any) => Promise<void>;
    down: (db: any) => Promise<void>;
}

export interface IDatabaseClient {
    init(): Promise<void>;
    execute(query: string, params?: any[]): Promise<any>;
    transaction(callback: (tx: any) => Promise<void>): Promise<void>;
}
