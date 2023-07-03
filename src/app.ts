
import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import { startServer } from "./config/configServer";
import indexV1 from "./v1/index";

export const app = express();

app.use(cors());
app.use(json());
app.use("/v1", indexV1);
app.use("/status", (_, res) => res.status(200).json({message: "Server is running"}));

//Todo:delete and put users;
app.listen(process.env.PORT, startServer);