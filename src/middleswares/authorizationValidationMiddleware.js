export default function authorizationValidationMiddleware(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (token === "" || token === undefined) {
    return res.status(401).send({ message: "Usuário não autorizado!" });
  }

  next();
}
