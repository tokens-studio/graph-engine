import "reflect-metadata";

import "dotenv/config";
//Import immediately for tracing
import "./tracing";
import { app } from "./app.js";

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
