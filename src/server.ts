import path from 'path';
import { Application } from 'express';
import { App, Initializer, globalTemplateValues } from '@BridgemanAccessible/ba-web-framework';

import { createConn } from './utils/db';

/**
 * Create the initial database connection
 * 
 * This includes setting up the connection options and creating the connection itself.
 */
async function createInitialDatabaseConnection() {
    // Setup the database connection options
    const connOptions = {
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production'
    }

    // Create a connection to the database
    await createConn('postgres', connOptions);
}

async function onStart(app: Application) {
    // Create the initial database connection
    createInitialDatabaseConnection();
}

async function main() {
    await new App().run(new Initializer({
        controllersPath: path.join(__dirname, 'routes'),
        staticFilesPath: path.join(__dirname, 'static'),
        view: {
            engine: 'ejs',
            filesPath: path.join(__dirname, 'pages')
        }
    }, globalTemplateValues({ company: process.env.COMPANY, titleSuffix: process.env.WEBSITE_TITLE_SUFFIX, hostname: process.env.HOSTNAME })), onStart);
}

main()