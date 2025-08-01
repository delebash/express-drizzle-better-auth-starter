import Joi from "joi";
import pkg from 'express';
const { Request, Response, NextFunction } = pkg;

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true, // Remove unknown fields (sanitization)
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({ message: errorMessage });
    }

    // Validated data is available in req.body
    next();
  };
};
