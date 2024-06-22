const cassandra = require('cassandra-driver');

require('dotenv').config();

const cloud = { secureConnectBundle: process.env['ASTRA_DB_SECURE_BUNDLE_PATH'] };
const authProvider = new cassandra.auth.PlainTextAuthProvider('token', process.env['ASTRA_DB_APPLICATION_TOKEN']);
const client = new cassandra.Client({ cloud, authProvider });

async function run() {
    await client.connect();

    // Create the 'recipes' table
    await client.execute(`
        CREATE TABLE IF NOT EXISTS recipes (
            id UUID PRIMARY KEY,
            name TEXT,
            description TEXT,
            user_id UUID
        );
    `);

    // Create the 'ingredients' table
    await client.execute(`
        CREATE TABLE IF NOT EXISTS ingredients (
            id UUID PRIMARY KEY,
            name TEXT,
            description TEXT,
            category TEXT
        );
    `);

    // Create the 'users' table
    await client.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY,
            username TEXT,
            email TEXT
        );
    `);

    console.log("Tables created successfully");
    await client.shutdown();
}

run().catch(console.error);