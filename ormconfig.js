//ormconfig.js
require('dotenv').config();
const typeorm = require("typeorm");
const GovermentSupportProject = require("./GovernmentSupportProjectSchema")

const dataSource = new typeorm.DataSource ({
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging:  process.env.DB_LOGGING === "TRUE",
    entities: [
        GovermentSupportProject
    ],
    migrations: [
        "./migrations/*.js"
    ],
    cli: {
        migrationsDir: './migrations'
    }
});

module.exports = { dataSource }