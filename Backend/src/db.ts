import * as cassandra from 'cassandra-driver';
import { config } from 'dotenv'

config();

if(!process.env['ASTRA_DB_APPLICATION_TOKEN'] || !process.env['ASTRA_DB_SECURE_BUNDLE_PATH']) throw new Error('Please provide the Astra DB Application Token and Secure Bundle Path in the .env file');

const cloud = { secureConnectBundle: process.env['ASTRA_DB_SECURE_BUNDLE_PATH'] };
const authProvider = new cassandra.auth.PlainTextAuthProvider('token', process.env['ASTRA_DB_APPLICATION_TOKEN']);
const client = new cassandra.Client({ cloud, authProvider });

export default client;