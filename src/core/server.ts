import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import { ExpressApp } from '@core';
import { TaskController } from '@api';

// Init express application
const app = new ExpressApp();

// Register middleware
app.useMiddleware([
    logger('dev'),
    express.json(),
    express.urlencoded({ extended: true }),
    cookieParser(),
]);

app.useControllers([
    TaskController,
]);

export { app };
