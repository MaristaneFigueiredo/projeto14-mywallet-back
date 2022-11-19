import { Router } from "express";
import { postSignUp, postSignIn } from "../controllers/authController.js";
import signUpValidation from "../middleswares/signUpValidationMiddleware.js";
import signInValidation from "../middleswares/signInValidationMiddleware.js";

const authRouter = Router();
authRouter.post("/sign-up", signUpValidation, postSignUp);
authRouter.post("/sign-in", signInValidation, postSignIn);

export default authRouter; // é um objeto de rotas q o express gerenciará.
