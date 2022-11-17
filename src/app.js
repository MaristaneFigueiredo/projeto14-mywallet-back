import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient } from "mongodb";
import {postSignUp, postSignIn } from "./controllers/usersController"



// Modelo desejados para valores
const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const recordSchema = joi.object({
  value: joi.number().precision(2).required(),
  //value: joi.required(),
  description: joi.string().required().min(3).max(100),

});

//config
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config(); // configura as variáveis de ambiente

//Conexao banco
const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
  await mongoClient.connect();
} catch (err) {
  console.log(err);
}

const db = mongoClient.db("myWallet");
const userCollection = db.collection("users");
const sessionCollection = db.collection("sessions");
const recordCollection = db.collection("records");

// Rotas
//POST SIGN-UP
app.post("/sign-up", postSignUp);

//POST SIGN-IN - LOGIN
app.post("/sign-in", postSignIn);

// POST Records entrada
app.post("/records-entry", postRecordsEntry);

// POST Records exit
app.post("/records-exit", postRecordsExit );

// GET Records
app.get("/records", getRecords);


//Definição da porta
app.listen(5000, () => console.log("Server running in port 5000"));

//30 minutos
