export default function emailValidationMiddleware(req, res, next) {
  const { email, password } = req.body;

  if (email === "" || email === undefined) {
    return res.status(422).send({ message: "Favor informar o Email!" });
  }

  if (password === "" || password === undefined) {
    return res.status(422).send({ message: "Favor informar a senha!" });
  }

  next();
}
