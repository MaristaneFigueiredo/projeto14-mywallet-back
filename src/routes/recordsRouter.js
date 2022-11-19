import { Router } from "express";
import {
  postRecordsEntry,
  postRecordsExit,
  getRecords,
} from "../controllers/recordsController.js";
import recordSchemaMiddleware from "../middleswares/recordSchemaMiddleware.js";
import tokenValidation from "../middleswares/tokenValidationMiddleware.js";

const recordsRouter = Router();

// POST Records entrada
recordsRouter.post(
  "/records-entry",
  recordSchemaMiddleware,
  tokenValidation,
  postRecordsEntry
);

// POST Records exit
recordsRouter.post(
  "/records-exit",
  recordSchemaMiddleware,
  tokenValidation,
  postRecordsExit
);

// GET Records
recordsRouter.get("/records", tokenValidation, getRecords);

export default recordsRouter;
