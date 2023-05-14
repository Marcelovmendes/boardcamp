import Joi from 'joi'

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    cpf: Joi.string().min(10).required(),
    birthday: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
})