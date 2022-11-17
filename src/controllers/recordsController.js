export async function postRecordsEntry(req, res) {
    const record = req.body;
    const { authorization } = req.headers; // Formato do "Bearer Token" - O token chegará pela requisição. O "Bearer" não é importante no back-end, é só um padrão de mercado
    //console.log("authorization", authorization);
    try {
  
      // O validation retorna objeto, e dentro deste objeto temos o "error" que é o que realmente importa
      const { error } = recordSchema.validate(record, {
        abortEarly: false,
      });
  
      if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(422).send(errors);
        //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
      }
  
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
  
export async function postRecordsExit (req, res) {
    const record = req.body;
    const { authorization } = req.headers; 
    try {    
      const { error } = recordSchema.validate(record, {
        abortEarly: false,
      });
  
      if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(422).send(errors);
        //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
      }
  
  
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
  
export async function getRecords (req, res)  {
    const { authorization } = req.headers; // Formato do "Bearer Token" - O token chegará pela requisição. O "Bearer" não é importante no back-end, é só um padrão de mercado
  
    const token = authorization?.replace("Bearer ", ""); // o token é só uma string, não preciso do "Bearer " que vem na requisição        
    /* conhecimento plus: uma interrogação(optional chaining) faz com q qualquer variável se torne opcional
      no caso acima, se o authorization não for informado, será devolvido "underfined", com isso não terei problemas com o replace
    */
  
    if (!token) {
      return res.status(401).send({ message: "Usuário não autorizado!" });
    }
  
    try {
      
      // Preciso verificar se esse usuário é o mesmo que está logado
      const session = await sessionCollection.findOne({ token });
      //console.log(session.userID);
  
         // Eu só qro q tenha acesso a essa rota pessoas logadas.
       if (!session) {
          return res.status(401).send({ message: "Usuário não autorizado!" });
       }
      
      //se eu quiser mandar o usuário junto com os registros(records)
      const user = await userCollection.findOne({ _id: session?.userID });
      //se o usuário não existir
      if (!user) {
        return res.sendStatus(401)
      }
   
  
      const records = await recordCollection.find({ userId: session?.userID });
  
      // não é uma boa prática e tbm é uma camada a mais de segurança,  não é legal retornar o password do usuário no objeto de usuário
      delete user.password;
  
      res.send(records, user);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  }
  