import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt"; //bcrypt - biblioteca do javascript para encriptar qualquer tipo de dado

// Modelo desejados para valores
const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
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

// Rotas
//POST SIGN-UP
app.post("/sign-up", async (req, res) => {
  const user = req.body;
  try {
    const userExists = await userCollection.findOne({ email: user.email });
    if (userExists) {
      return res.status(409).send({ message: "Esse email já existe!" });
      //409: Conflict => Significa que o recurso que você está tentando inserir já foi inserido
    }

    // O validation retorna o objeto e dentro deste o objeto temos o "erro" que é realmente o que importa
    const { error } = userSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(422).send(errors);
      //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
    }

    //criptografar a senha
    const hashPassword = bcrypt.hashSync(user.password, 10); // fará um hash de forma síncrona - é necessário passar dois parâmetros: Dado e buffer(rodas de saltos de criptografia - cria um hash elevado a potência de vezes)
    console.log(hashPassword);

    //await userCollection.insertOne(user);
    await userCollection.insertOne({ ...user, password: hashPassword });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
    //500: Internal Server Error => Significa que ocorreu algum erro desconhecido no servidor
  }
});

//POST SIGN-IN - LOGIN
app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body; // tudo que vc preenche no formulário, vc recebe por body

  try {
    const userExists = await userCollection.findOne({ email });
    if (!userExists) {
      return res.status(401).send({ message: "Usuário não autorizado!" });
    }

    const passwordOk = bcrypt.compareSync(password, userExists.password); // dois parâmetros: O dado que qro validar / dado encriptado
    if (!passwordOk) {
      return res.sendStatus(401);
    }

    res.send({ message: `Olá ${userExists.name}, seja bem vindo(a)!` });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
});

//Definição da porta
app.listen(5000, () => console.log("Server running in port 5000"));
