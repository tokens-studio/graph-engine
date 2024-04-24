
import express from "express";
import cors from 'cors';
import promMid from 'express-prometheus-middleware';
import bodyParser from "body-parser";
import { RegisterRoutes } from "./generated/routes";
import swaggerUi from 'swagger-ui-express';
// import swaggerDoc from './generated/swagger.json';
import { errorHandler } from "./middleware/error";

export const app = express();

const swaggerDoc = await import('./generated/swagger.json');


app.use(cors());
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
// app.use(CookieParser());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
RegisterRoutes(app);

app.use(errorHandler);

