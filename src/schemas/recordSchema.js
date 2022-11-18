import joi from "joi";

const recordSchema = joi.object({
  value: joi.number().precision(2).required(),
  description: joi.string().required().min(3).max(100),
});

export default recordSchema;
