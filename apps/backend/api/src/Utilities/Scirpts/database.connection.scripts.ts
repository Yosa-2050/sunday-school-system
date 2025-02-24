import { config } from 'dotenv';
import { createConnection } from 'typeorm';
import { SchemaNames } from '../enums/schema-names.enums';

// Load environment variables from .env file

async function createDatabaseAndSchema() {
    try {
        config();

        const connectionWithDatabase = await createConnection({
            type: 'postgres',
            host: process.env.POSTGRES_HOST.toString(),
            port: Number(process.env.POSTGRES_PORT.toString()),
            username: process.env.POSTGRES_USER.toString(),
            password: process.env.POSTGRES_PASSWORD.toString(),
            database: process.env.POSTGRES_DATABASE.toString(),
        });

        // Create the schema if it does not exist
        const enumValues = Object.values(SchemaNames);

        for (const value of enumValues) {
            await connectionWithDatabase.query(
                `CREATE SCHEMA IF NOT EXISTS "${value}"`,
            );
        }
    } catch (error) {
        //TODO: add logger
        //console.error('Error creating database and schema:', error);
    }
}

createDatabaseAndSchema();
