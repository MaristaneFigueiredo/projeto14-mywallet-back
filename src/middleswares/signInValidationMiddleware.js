import { userCollection, sessionCollection } from "../database/db.js";
import bcrypt from "bcrypt";

export default async function signInValidation(req, res, next) {
  const { email, password } = req.body;

  if (email === "" || email === undefined) {
    return res.status(422).send({ message: "Favor informar o Email!" });
  }

  if (password === "" || password === undefined) {
    return res.status(422).send({ message: "Favor informar a senha!" });
  }

  try {
    const userExists = await userCollection.findOne({ email }); //true

    if (!userExists) {
      return res.status(401).send({ message: "Usuário não autorizado!" });
    }

    const passwordOk = bcrypt.compareSync(password, userExists.password); // dois parâmetros: O dado que qro validar / dado encriptado

    if (!passwordOk) {
      return res.status(401).send({ message: "Senha incorreta!" });
    }

    const sessionExists = await sessionCollection.findOne({
      userId: userExists._id,
    });

    if (sessionExists) {
      return res.status(401).send({ message: "Usuário já logado!" });
    }

    req.userExists = userExists._id;
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
    //500: Internal Server Error => Significa que ocorreu algum erro desconhecido no servidor
  }

  next();
}
