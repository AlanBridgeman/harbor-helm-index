import path from 'path';
import { DataSource } from 'typeorm';

/**
 * Creates a connection to the database.
 * 
 * @param kwargs Other keyword arguments to pass to the TypeORM DataSource. (ex. { logging: true })
 * @returns A connection to the database.
 */
async function createPostgreSQLConn(kwargs: object): Promise<DataSource> {
    // Parse the database connection information from the environment variables
    const DB_HOST = process.env.DB_HOST;
    const DB_PORT: number = typeof process.env.DB_PORT !== 'undefined' ? parseInt(process.env.DB_PORT) : 5432;
    const DB_USER = process.env.DB_USER || 'postgres';
    const DB_PASSWORD = process.env.DB_PASSWORD || 'db_password';
    const DB_NAME = process.env.DB_NAME || 'db';

    console.log(`Attempting to connect to ${DB_HOST} at port ${DB_PORT} on database ${DB_NAME} as ${DB_USER} with password ${DB_PASSWORD}`);

    // Create the connection
    return new DataSource({
        type: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        //ssl: process.env.NODE_ENV === 'production' ? true : false,
        ...kwargs,
        entities: [
            path.resolve(__dirname, '../', './entity/**/*.ts'),
            path.resolve(__dirname, '../', './entity/**/*.js')
        ]
    }).initialize();
}

/**
 * Creates a connection to the SQLite database.
 * 
 * @param kwargs Other keyword arguments to pass to the TypeORM DataSource. (ex. { logging: true })
 * @returns The connection to the database.
 */
async function createSQLiteConn(kwargs: object): Promise<DataSource> {
    // Parse the database connection information from the environment variables
    const DB_NAME = process.env.DATABASE_FILE || 'database.sqlite';

    console.log(`Attempting to connect to ${DB_NAME}`);

    // Create the connection
    return new DataSource({
        type: "sqlite",
        database: DB_NAME,
        ...kwargs,
        entities: [
            path.resolve(__dirname, '../', './entity/**/*.ts'),
            path.resolve(__dirname, '../', './entity/**/*.js')
        ]
    }).initialize();
}

/**
 * The types of databases that can be connected to.
 */
type DBTypes = 'sqlite' | 'postgres';

/**
 * Creates a connection to the database.
 * 
 * @param kwargs The keyword arguments to pass to the TypeORM DataSource. (ex. { logging: true })
 * @returns The connection to the database.
 */
export async function createConn(dbType: DBTypes, kwargs: object): Promise<DataSource> {
    // Return the connection based on the database type
    switch(dbType) {
        case 'sqlite':
            return createSQLiteConn(kwargs);
            break;
        case 'postgres':
            return createPostgreSQLConn(kwargs);
            break;
    }
}