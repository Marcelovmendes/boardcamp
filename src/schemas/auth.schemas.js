import Joi from 'joi'

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    cpf: Joi.string().min(11).required(),
    birthday: Joi.date().required()
})