
import { recordCollection, userCollection, sessionCollection } from "../db.js";

export async function postRecordsEntry(req, res) {
  const record = req.body;
  const { authorization } = req.headers; // Formato do "Bearer Token" - O token chegará pela requisição. O "Bearer" não é importante no back-end, é só um padrão de mercado
  
  try {
    /* destrinchando conhecimento
        O token - é usado para a segurança de quem é o usuário que ESTÁ LOGADO
        O id é para eu encontrar o usuário dentro do banco de dados para algum filtro
      */

    const token = authorization?.replace("Bearer ", "");

    const session = await sessionCollection.findOne({ token });
    // Só pode acessar essa rota pessoas autorizadas
    if (!session) {
      return res.status(401).send({ message: "Usuário não autorizado!" });
    }

    await recordCollection.insertOne({
      value: record.value,
      description: record.description,
      typeRecord: "E",
      userId: session.userId,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
}

export async function postRecordsExit(req, res) {
  const record = req.body;
  const { authorization } = req.headers;
  try {
    const token = authorization?.replace("Bearer ", "");

    const session = await sessionCollection.findOne({ token });
    // Só pode acessar essa rota pessoas autorizadas
    if (!session) {
      return res.status(401).send({ message: "Usuário não autorizado!" });
    }

    await recordCollection.insertOne({
      value: record.value,
      description: record.description,
      typeRecord: "S",
      userId: session.userId,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
}

export async function getRecords(req, res) {
  const { authorization } = req.headers; // Formato do "Bearer Token" - O token chegará pela requisição. O "Bearer" não é importante no back-end, é só um padrão de mercado
  
  try {   
   
    const token = authorization?.replace("Bearer ", ""); 

    const session = await sessionCollection.findOne({ token });    
    // Eu só qro q tenha acesso a essa rota pessoas logadas.
    if (!session) {
      return res.status(401).send({ message: "Usuário não autorizado!" });
    }

     
    const user = await userCollection.findOne({ _id: session?.userId });    
    if (!user) {            
      return res.status(401).send({ message: "Usuário não encontrado!" });
    }

    const records = await recordCollection.find({ userId: session?.userId }).toArray();

    // não é uma boa prática e tbm é uma camada a mais de segurança,  não é legal retornar o password do usuário no objeto de usuário
    delete user.password;

    res.send({records, user});    

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
}
