import '../util/load-env'; // Must be the first import
import { app } from '@core';
import { logger } from '@core';
import { DbService } from '@database';

// Start the server
async function bootstrap() {
    // initialize database
    const dbService = new DbService();
    await dbService.connect();
    // start express application
    await app.start();
    logger.info(`Application is running on http://localhost:${app.getPort()}/`);
}

bootstrap();
