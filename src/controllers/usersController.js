import bcrypt from "bcrypt"; //bcrypt - biblioteca do javascript para encriptar qualquer tipo de dado
import { v4 as uuidV4 } from "uuid"; // versão 4 é que gera string

export async function postSignUp (req, res) {
    const user = req.body;
    try {
  
      // O validation retorna objeto, e dentro deste objeto temos o "error" que é o que realmente importa
      const { error } = userSchema.validate(user, { abortEarly: false });
  
      if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(422).send(errors);
        //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
      }
  
      const userExists = await userCollection.findOne({ email: user.email });
      if (userExists) {
        return res.status(409).send({ message: "Esse email já existe!" });
        //409: Conflict => Significa que o recurso que você está tentando inserir já foi inserido
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
  }
  
export async function postSignIn(req, res)  {
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
      const token = uuidV4();
      console.log("token", token);
  
      // sessão - uma janela de tempo q o usuário está logado no dispositivo
      await sessionCollection.insertOne({
        userId: userExists._id,
        token,
      });
  
      res.send({ token }); // é uma excelente prática retornar de qualquer sign-in apenas o token
  
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  }