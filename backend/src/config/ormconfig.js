require('dotenv/config');
const databasePaths = {
    development: {
        entities: ['./src/modules/**/infra/database/entities/*.ts'],
        migrations: ['./src/shared/infra/database/migrations/*.ts'],
        migrationsDir: './src/shared/infra/database/migrations',
        schemas: ['./src/modules/**/infra/database/schemas/*{.ts,.js}'],
    },
    production: {
        entities: ['./dist/modules/**/infra/database/entities/*.js'],
        migrations: ['./dist/shared/infra/database/migrations/*.js'],
        migrationsDir: './dist/shared/infra/database/migrations',
        schemas: ['./dist/modules/**/infra/database/schemas/*.js'],
    },
};

module.exports = [
    {
        logging: true,
        name: 'default',
        type: 'mysql',
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306', 10),
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '123456',
        database: process.env.MYSQL_DATABASE || 'syncvideo',
        entities: databasePaths[process.env.APP_ENV].entities,
        migrations: databasePaths[process.env.APP_ENV].migrations,
        cli: {
            migrationsDir: databasePaths[process.env.APP_ENV].migrationsDir,
        },
    },
    {
        logging: true,
        name: 'mongo',
        type: 'mongodb',
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || '27017',
        database: process.env.MONGO_DATABASE || 'syncvideo',
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        useUnifiedTopology: true,
        entities: databasePaths[process.env.APP_ENV].schemas,
    },
];
