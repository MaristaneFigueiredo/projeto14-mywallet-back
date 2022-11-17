import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt"; //bcrypt - biblioteca do javascript para encriptar qualquer tipo de dado
import { v4 as uuid } from "uuid"; // versão 4 é que gera string

// Modelo desejados para valores
const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const recordSchema = joi.object({
  value: joi.number().required(),
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
app.post("/sign-up", async (req, res) => {
  const user = req.body;
  try {
    const userExists = await userCollection.findOne({ email: user.email });
    if (userExists) {
      return res.status(409).send({ message: "Esse email já existe!" });
      //409: Conflict => Significa que o recurso que você está tentando inserir já foi inserido
    }

    // O validation retorna objeto, e dentro deste objeto temos o "error" que é o que realmente importa
    const { error } = userSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(422).send(errors);
      //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
    }

    //criptografar a senha
    const hashPassword = bcrypt.hashSync(user.password, 10); // fará um hash de forma síncrona - é necessário passar dois parâmetros: Dado e buffer(rodas de saltos de criptografia - cria um hash elevado a potência de vezes)

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
    //console.log("userExists", userExists);

    if (!userExists) {
      return res.status(401).send({ message: "Usuário não autorizado!" });
    }

    const passwordOk = bcrypt.compareSync(password, userExists.password); // dois parâmetros: O dado que qro validar / dado encriptado

    if (!passwordOk) {
      return res.sendStatus(401);
    }

    //gerando token (chave - é uma string de um número aleatório único)
    const token = uuid();
    console.log("token", token);
    // sessão - uma janela de tempo q o usuário está logado no dispositivo
    await sessionCollection.insertOne({
      userId: userExists._id,
      token,
    });

    res.send(token);
    //res.send({ message: `Olá ${userExists.name}, seja bem vindo(a)!` });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
});

// POST Records entrada
app.post("/records-entry", async (req, res) => {
  const { value, description } = req.body;
  const { authorization } = req.headers; // Formato do "Bearer Token" - O token chegará pela requisição. O "Bearer" não é importante no back-end, é só um padrão de mercado
  console.log("authorization", authorization);
  try {
    const token = authorization?.replace("Bearer ", "");
    const session = await sessionCollection.findOne({ token });
    const user = await userCollection.findOne({ _id: session?.userID });
    // Só pode acessar essa rota pessoas logadas e autorizadas
    if (!session && !user) {
      return res.status(401).send({ message: "Usuário não autorizado!" });
    }

    // O validation retorna objeto, e dentro deste objeto temos o "error" que é o que realmente importa
    const { error } = recordSchema.validate(value, description, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(422).send(errors);
      //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
    }

    await recordCollection.insertOne({
      value,
      description,
      typeRecord: "E",
      userId: session.userId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
});

// POST Records exit
app.post("/records-exit", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
});

// GET Records
app.get("/records", async (req, res) => {
  const { authorization } = req.headers; // Formato do "Bearer Token" - O token chegará pela requisição. O "Bearer" não é importante no back-end, é só um padrão de mercado

  // Eu só qro q tenha acesso a essa rota pessoas logadas.
  if (!authorization) {
    return res.status(401).send({ message: "Usuário não autorizado!" });
  }
  try {
    // Preciso verificar se esse usuário é o mesmo que está logado
    const token = authorization?.replace("Bearer ", ""); // o token é só uma string, não preciso do "Bearer " que vem na requisição
    // obs.: uma interrogação(opcional change) faz com q qualquer variável seja opcional
    //console.log(token);

    const session = await sessionCollection.findOne({ token });
    console.log(session.userID);
    const user = await userCollection.findOne({ _id: session?.userID });
    if (!user) {
      return res.sendStatus(401);
    }

    const records = await recordCollection.find({ email: user.email });

    // como uma camada a mais de segurança não retornar o password do usuário
    delete user.password;

    res.send(records, user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
});

//Definição da porta
app.listen(5000, () => console.log("Server running in port 5000"));

//42 minutos
