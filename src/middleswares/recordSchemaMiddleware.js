import recordSchema from "../schemas/recordSchema.js";

export default function validationRecordSchema(req, res, next) {
  const record = req.body;

  // O validation retorna objeto, e dentro deste objeto temos o "error" que é o que realmente importa
  const { error } = recordSchema.validate(user, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).send(errors);
    //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
  }

  next();
}
