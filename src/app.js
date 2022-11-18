import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import recordsRouter from "./routes/recordsRouter.js";


//config
const app = express();
app.use(express.json());
app.use(cors());

//routes - para as rotas funcionarem elas precisam ser chamadas
app.use(authRouter); 
app.use(recordsRouter);


//Definição da porta
app.listen(5000, () => console.log("Server running in port 5000"));
