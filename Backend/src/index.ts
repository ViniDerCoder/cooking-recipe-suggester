import https from 'https';
import fs from 'fs';
import { config } from 'dotenv'

config();

import app from './app.js';
import client from './db.js';
import onReady, { ready } from './utils/listener/ready.js';
import { insertAll } from './utils/default_db_vals/insertAll.js';
import onInterval from './utils/listener/interval.js';
import { cleanup } from './utils/listener/cleanup.js';

console.log("Setting up the Express server");

if (!process.env['EXPRESS_PORT']) throw new Error('Please provide the port for the Express server in the .env file');

const port = process.env['EXPRESS_PORT'];

const sslOptions = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
};

let appConnected = false;
https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Express Server running on port ${port}`);
    appConnected = true;
});

console.log("Setting up the Cassandra client");

let clientConnected = false;
client.connect().then(() => {
    console.log("Connected to Cassandra");
    clientConnected = true;
})

const readyCheckInterval = setInterval(() => {
    if(clientConnected && appConnected) {
        console.log("Server is ready");
        ready();
        clearInterval(readyCheckInterval);
    }
}, 50)

onInterval('cleanup', 60 * 24, async () => {
    cleanup("ALL");
}, new Date().setHours(0, 0, 0, 0));

onInterval('memoryCleanup', 60 * 24, async () => {
    cleanup("MEMORY");
}, new Date().setHours(12, 0, 0, 0));

onReady("defaultDatabaseValues", async () => {
    await insertAll();
});