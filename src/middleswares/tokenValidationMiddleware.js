import { userCollection, sessionCollection } from "../database/db.js";

export default async function tokenValidation(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ message: "Usuário não autorizado!" });
  }

  const session = await sessionCollection.findOne({ token });
  if (!session) {
    return res.status(401).send({ message: "Usuário não autorizado!" });
  }

  const user = await userCollection.findOne({ _id: session.userId });
  if (!user) {
    return res.status(401).send({ message: "Usuário não autorizado!" });
  }

  res.locals.user = user;

  next();
}

/* destrinchando conhecimento
        O token - é usado para a segurança de quem é o usuário que ESTÁ LOGADO
        O id serve para encontrar o usuário dentro do banco de dados por algum filtro
*/
