import userSchema from "../schemas/userSchema.js";
import { userCollection } from "../database/db.js";

export default async function signUpValidation(req, res, next) {
  const user = req.body;

  const { error } = userSchema.validate(user, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).send(errors);
    //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
  }

  try {
    const userExists = await userCollection.findOne({ email: user.email });
    if (userExists) {
      return res.status(409).send({ message: "Este email já existe!" });
      //409: Conflict => Significa que o recurso que você está tentando inserir já foi inserido
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
    //500: Internal Server Error => Significa que ocorreu algum erro desconhecido no servidor
  }

  next();
}
