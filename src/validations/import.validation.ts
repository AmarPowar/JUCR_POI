import Joi from 'joi';

const importPOIDataValidator = {
    body: Joi.object().keys({
        filters: Joi.object()
            .keys({
                machineId: Joi.string().required(),
            })
            .optional(),
    }),
};


export default importPOIDataValidator;