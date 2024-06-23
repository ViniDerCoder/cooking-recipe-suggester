import { config } from 'dotenv'

config();

import app from './app.js';
import client from './db.js';

console.log("Setting up the Express server");

if (!process.env['EXPRESS_PORT']) throw new Error('Please provide the port for the Express server in the .env file');

const port = process.env['EXPRESS_PORT'];
app.listen(port, () => {
    console.log(`Express Server running on port ${port}`);
});

console.log("Setting up the Cassandra client");

/*client.connect().then(() => {
    console.log("Connected to Cassandra");
})*/