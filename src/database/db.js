import { MongoClient } from "mongodb";
import dotenv from "dotenv";

//config
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
  await mongoClient.connect();
  console.log("Banco conectado!");
} catch (err) {
  console.log(err);
}
const db = mongoClient.db("myWallet");

export const userCollection = db.collection("users");
export const sessionCollection = db.collection("sessions");
export const recordCollection = db.collection("records");

export default db;
