import { Router } from "express";
import { postSignUp, postSignIn } from "../controllers/authController.js";
import userSchemaMiddleware from "../middleswares/userSchemaMiddleware.js";
import emailValidationMiddleware from "../middleswares/emailValidationMiddleware.js";

const authRouter = Router();
authRouter.post("/sign-up", userSchemaMiddleware, postSignUp);
authRouter.post("/sign-in", emailValidationMiddleware, postSignIn);

export default authRouter;
