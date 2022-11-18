import userSchema from "../schemas/userSchema.js";

export default function validationUserSchema(req, res, next) {
  const user = req.body;

  const { error } = userSchema.validate(user, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).send(errors);
    //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
  }

  next();
}
