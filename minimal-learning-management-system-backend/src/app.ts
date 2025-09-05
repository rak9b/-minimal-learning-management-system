import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { corsMethods, corsOptions } from "./constants/origin";
import { ApplicationRootRoute } from "./routes/root.route";
import notFoundAPI from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

// middleware--------
app.use([express.json(), express.urlencoded({ extended: true })]);

app.use(
  cors({
    origin: corsOptions,
    credentials: true,
    methods: corsMethods,
    // optionsSuccessStatus: 200,
  })
);

//*This Middleware helps to prevent Cross-Site Scripting(XSS)
app.use(helmet.xssFilter());

// Application Route---------------
app.use("/api/v1", ApplicationRootRoute);

//Root Route-----------
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .send("Welcome to Minimal Learning Management System Backend!");
});
// Handle Not Found API -------
app.use(notFoundAPI);

// handle global error
app.use(globalErrorHandler);
export default app;
