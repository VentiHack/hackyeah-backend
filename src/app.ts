import express from "express";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import { index } from "./routes/index";
// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use("/", index);

app.use(errorNotFoundHandler);
app.use(errorHandler);
