const cassandra = require('cassandra-driver');

require('dotenv').config();

const cloud = { secureConnectBundle: process.env['ASTRA_DB_SECURE_BUNDLE_PATH'] };
const authProvider = new cassandra.auth.PlainTextAuthProvider('token', process.env['ASTRA_DB_APPLICATION_TOKEN']);
const client = new cassandra.Client({ cloud, authProvider });

async function run() {
    await client.connect();
    

    console.log("Tables created successfully");
    await client.shutdown();
}

//run().catch(console.error);