import { QuickSQLiteConnection, open } from 'react-native-quick-sqlite';
import { IDatabaseClient } from '../../core/types/database';

class DatabaseClient implements IDatabaseClient {
    private static instance: DatabaseClient;
    private db: QuickSQLiteConnection | null = null;
    private readonly DB_NAME = 'limitlift.db';

    private constructor() { }

    public static getInstance(): DatabaseClient {
        if (!DatabaseClient.instance) {
            DatabaseClient.instance = new DatabaseClient();
        }
        return DatabaseClient.instance;
    }

    public async init(): Promise<void> {
        if (this.db) {
            return;
        }

        try {
            this.db = open({ name: this.DB_NAME });
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    public getDb(): QuickSQLiteConnection {
        if (!this.db) {
            throw new Error('Database not initialized. Call init() first.');
        }
        return this.db;
    }

    public async execute(query: string, params: any[] = []): Promise<any> {
        const db = this.getDb();
        try {
            const result = db.execute(query, params);
            return result;
        } catch (error) {
            console.error(`Query execution failed: ${query}`, error);
            throw error;
        }
    }

    public async transaction(callback: (tx: any) => Promise<void>): Promise<void> {
        const db = this.getDb();
        try {
            await db.transaction(async (tx) => {
                await callback(tx);
            });
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }
}

export const databaseClient = DatabaseClient.getInstance();
