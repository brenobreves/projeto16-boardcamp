import Joi from "joi"

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().min(10).max(11).regex(/^\d+$/).required(),
    cpf: Joi.string().length(11).regex(/^\d+$/).required(),
    birthday: Joi.date().required()    
})