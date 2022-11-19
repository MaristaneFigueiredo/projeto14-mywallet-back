import bcrypt from "bcrypt"; //bcrypt - biblioteca do javascript para encriptar qualquer tipo de dado
import { v4 as uuidV4 } from "uuid"; // versão 4 é que gera string
import { userCollection, sessionCollection } from "../database/db.js";

export async function postSignUp(req, res) {
  const user = req.body;

  try {
    // //criptografar a senha
    const hashPassword = bcrypt.hashSync(user.password, 10); // fará um hash de forma síncrona - é necessário passar dois parâmetros: Dado e buffer(cria um hash elevado a potência de vezes)

    await userCollection.insertOne({ ...user, password: hashPassword });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
    //500: Internal Server Error => Significa que ocorreu algum erro desconhecido no servidor
  }
}

export async function postSignIn(req, res) {
  try {
    //gerando token (chave - é uma string de um número aleatório único)
    const token = uuidV4();

    const userExistsId = req.userExists;
    // sessão - uma janela de tempo q o usuário está logado no dispositivo
    await sessionCollection.insertOne({
      userId: userExistsId,
      token,
    });
    res.send(token); // é uma excelente prática retornar de qualquer sign-in apenas o token
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
}

export async function logout(req, res) {
  try {
    const user = res.locals.user;

    //console.log("user", user);

    await sessionCollection.deleteOne({ userId: user._id });
    return res.status(200).send({ message: "ok!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
}
