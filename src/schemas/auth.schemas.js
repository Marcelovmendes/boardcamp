import Joi from 'joi'

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    cpf: joi.string().trim().length(11).pattern(/^\d+$/).messages({'string.pattern.base': `Phone must be a string with 10 or 11 numeric digits.`}).required(),
    birthday: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
})