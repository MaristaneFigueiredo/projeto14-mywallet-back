import express from "express";
import cors from "cors";
//import joi from "joi";

import authRouter from "./routes/authRouter.js";
import recordsRouter from "./routes/recordsRouter.js";

// // Modelo desejados para tratar valores
// export const userSchema = joi.object({
//   name: joi.string().required().min(3).max(100),
//   email: joi.string().email().required(),
//   password: joi.string().required(),
// });

// export const recordSchema = joi.object({
//   value: joi.number().precision(2).required(),
//   description: joi.string().required().min(3).max(100),
// });

//config
const app = express();
app.use(express.json());
app.use(cors());

//routes
app.use(authRouter);
app.use(recordsRouter);

//Definição da porta
app.listen(5000, () => console.log("Server running in port 5000"));
