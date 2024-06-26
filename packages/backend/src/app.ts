
import express from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "../generated/routes";
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from "./middleware/error";
import swaggerDoc from '../generated/swagger.json';
export const app = express();

app.disable('x-powered-by');

// Use body parser to read sent json payloads
app.use(
    bodyParser.urlencoded({
        extended: true,
        //Anything larger than this is ridiculous
        limit: '8mb',
    })
);
app.use(bodyParser.json({
    //Anything larger than this is ridiculous
    limit: '8mb',
}));

if (process.env.NODE_ENV !== 'production') {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

RegisterRoutes(app);

app.use(errorHandler);

