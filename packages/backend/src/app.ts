
import express from "express";
import promMid from 'express-prometheus-middleware';
import bodyParser from "body-parser";
import { RegisterRoutes } from "./routes/routes";

export const app = express();


app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
}));
// Use body parser to read sent json payloads
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);