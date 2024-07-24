import express, { Express } from "express";
import DocumentRoute from "./routes/document.route";
import cors from "cors";

const Application: Express = express();

// cors
Application.use(cors());

// json
Application.use(express.json());
Application.use(express.urlencoded({ extended: true }));

// routes
Application.use("/", DocumentRoute);

export default Application;