export default function emailValidationMiddleware(req, res, next) {
  const { email, password } = req.body;


  console.log('email', email)

  if (email === "" || email === undefined) {
    return res.status(422).send({ message: "Favor informar o Email!" });
  }

  if (password === "" || password === undefined) {
    return res.status(422).send({ message: "Favor informar a senha!" });
  }

  next();
}

// import userSchema from "../schemas/userSchema.js";

// export default function emailValidationMiddleware(req, res, next) {
//   const { email, password } = req.body;


//   const { error } = userSchema.validate(email);
//   if (error) {   
//     return res.status(422).send({message: "Email inválido!"});
//     //422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
//   }

//   next();
// }
