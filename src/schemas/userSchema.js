import joi from "joi";

// Modelo desejado para os usuários em relação aos valores recebidos
const userSchema = joi.object({
  name: joi.string().required().min(3).max(100),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export default userSchema;
