import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";
import { createCustomer, getCustomers, getCustomersById, updateCustomer } from "../controllers/customers.controller.js";

const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomersById)
customerRouter.post("/customers", validateSchema(customerSchema), createCustomer)
customerRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomer)

export default customerRouter