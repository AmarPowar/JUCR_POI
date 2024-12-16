import { NextFunction, Response, Request } from 'express';
import Joi, { ObjectSchema } from 'joi';

/**
 *  Standard importPOI Schema
 */
export const importPOIDataValidator = {
    body: Joi.object({
        filters: Joi.object({
            page: Joi.number().required(),
            countrycode: Joi.string().optional(),
            compact: Joi.boolean().optional(),
            verbose: Joi.boolean().optional(),
            output: Joi.string().optional(),
            opendata: Joi.boolean().optional(),
            distance: Joi.number().optional(),
            maxresults: Joi.number().optional(),
        }).required(),
    }),
};

/**
 * Request Input Validator Method
 * @param schema 
 * @returns  
 */
export const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            res.status(400).json({
                message: "Validation error",
                details: error.details.map((detail) => detail.message),
            });
            return;
        }
        next();
    };
};


