import express from "express";
import cors from "cors";
import { router } from "./routes";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

app.use(cors({
  origin: 'http://localhost:8100', // porta do Ionic
  credentials: true
}));

app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

export { app };
