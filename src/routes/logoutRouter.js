import { Router } from "express";
import { logout } from "../controllers/authController.js";
import tokenValidation from "../middleswares/tokenValidationMiddleware.js";

const logoutRouter = Router();

logoutRouter.delete("/logout", tokenValidation, logout);

export default logoutRouter;
