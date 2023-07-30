import dayjs from "dayjs"
import {db} from "../database/database.connection.js"

export async function getCustomers(req, res){
    try {
        const customers = await db.query(`SELECT * FROM customers;`)
        res.send(customers.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomersById(req, res){
    const {id} = req.params
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`,[id])
        if(customer.rowCount === 0) return res.sendStatus(404)
        res.send(customer.rows[0])
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createCustomer(req, res){
    const {name, phone, cpf, birthday} = req.body
    try {
        const cpfValidation = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf])
        if(cpfValidation.rowCount !== 0) return res.sendStatus(409)
        const formatBday = dayjs(birthday).format('YYYY-MM-DD')
        console.log(formatBday)
        const newCust = await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);`, [name, phone, cpf, formatBday])
        res.sendStatus(201) 
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function updateCustomer(req, res){
    res.send("updateCustomer")
}