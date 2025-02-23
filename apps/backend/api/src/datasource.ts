import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT, 5432),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    entities: ['**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    migrationsRun: false,
    logging: true,
});
