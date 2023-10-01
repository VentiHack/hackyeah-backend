import path from "path";
import cors from "cors";
import express from "express";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import { api } from "./routes/api";
// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api", api);

app.use(errorNotFoundHandler);
app.use(errorHandler);
