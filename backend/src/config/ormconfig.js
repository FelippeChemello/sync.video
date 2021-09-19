require('dotenv/config');
const databasePaths = {
    development: {
        entities: ['./src/modules/**/infra/database/entities/*.ts'],
        migrations: ['./src/shared/infra/database/migrations/*.ts'],
        migrationsDir: './src/shared/infra/database/migrations',
    },
    production: {
        entities: ['./dist/modules/**/infra/database/entities/*.js'],
        migrations: ['./dist/shared/infra/database/migrations/*.js'],
        migrationsDir: './dist/shared/infra/database/migrations',
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
];
