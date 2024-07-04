import { config } from 'dotenv'

config();

import app from './app.js';
import client from './db.js';
import { ready } from './utils/listener/ready.js';

console.log("Setting up the Express server");

if (!process.env['EXPRESS_PORT']) throw new Error('Please provide the port for the Express server in the .env file');

const port = process.env['EXPRESS_PORT'];

let appConnected = false;
app.listen(port, () => {
    console.log(`Express Server running on port ${port}`);
    appConnected = true;
});

console.log("Setting up the Cassandra client");

let clientConnected = false;
client.connect().then(() => {
    console.log("Connected to Cassandra");
    clientConnected = true;
})

setInterval(() => {
    if(clientConnected && appConnected) {
        console.log("Server is ready");
        clearInterval(this);
        ready();
    }
}, 50)