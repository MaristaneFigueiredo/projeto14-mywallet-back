import { Router } from "express";
import {
  postRecordsEntry,
  postRecordsExit,
  getRecords,
} from "../controllers/recordsController.js";
import recordSchemaMiddleware from "../middleswares/recordSchemaMiddleware.js";
import authorizationValidationMiddleware from "../middleswares/authorizationValidationMiddleware.js";

const recordsRouter = Router();

// POST Records entrada
recordsRouter.post(
  "/records-entry",
  recordSchemaMiddleware,
  authorizationValidationMiddleware,
  postRecordsEntry
);

// POST Records exit
recordsRouter.post(
  "/records-exit",
  recordSchemaMiddleware,
  authorizationValidationMiddleware,
  postRecordsExit
);

// GET Records
recordsRouter.get("/records", authorizationValidationMiddleware, getRecords);

export default recordsRouter;
