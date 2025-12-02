import { databaseClient } from './DatabaseClient';
import { Migration } from '../../core/types/database';
import { Migration_001_Initial } from './migrations/Migration_001_Initial';
import { Migration_002_SchemaRefinement } from './migrations/Migration_002_SchemaRefinement';

class MigrationManager {
    private migrations: Migration[] = [
        Migration_001_Initial,
        Migration_002_SchemaRefinement,
    ];

    public async runMigrations(): Promise<void> {
        const db = databaseClient.getDb();

        // Create migrations table
        await db.execute(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        appliedAt TEXT NOT NULL
      );
    `);

        // Get applied migrations
        const result = await db.execute('SELECT name FROM _migrations');
        const appliedMigrations = new Set(result.rows?._array.map((row: any) => row.name) || []);

        // Run pending migrations
        for (const migration of this.migrations) {
            if (!appliedMigrations.has(migration.name)) {
                console.log(`Running migration: ${migration.name}`);
                try {
                    await migration.up(db);
                    await db.execute(
                        'INSERT INTO _migrations (name, appliedAt) VALUES (?, ?)',
                        [migration.name, new Date().toISOString()]
                    );
                    console.log(`Migration ${migration.name} applied successfully`);
                } catch (error) {
                    console.error(`Failed to apply migration ${migration.name}:`, error);
                    throw error;
                }
            }
        }
    }
}

export const migrationManager = new MigrationManager();
