import { databaseClient } from '../../infrastructure/database/DatabaseClient';

export abstract class BaseRepository<T> {
    protected abstract tableName: string;

    protected async execute(query: string, params: any[] = []): Promise<any> {
        return databaseClient.execute(query, params);
    }

    public async findAll(): Promise<T[]> {
        const result = await this.execute(`SELECT * FROM ${this.tableName}`);
        return result.rows?._array || [];
    }

    public async findById(id: string): Promise<T | null> {
        const result = await this.execute(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        const rows = result.rows?._array;
        return rows && rows.length > 0 ? rows[0] : null;
    }

    public async create(entity: T): Promise<void> {
        const keys = Object.keys(entity as any);
        const values = Object.values(entity as any);
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.join(', ');

        await this.execute(
            `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
            values
        );
    }

    public async update(id: string, entity: Partial<T>): Promise<void> {
        const keys = Object.keys(entity);
        const values = Object.values(entity);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        await this.execute(
            `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
    }

    public async delete(id: string): Promise<void> {
        await this.execute(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    }
}
