import dayjs from "dayjs"
import {db} from "../database/database.connection.js"

function formataBday(date){
    return dayjs(date).format('YYYY-MM-DD')
}

export async function getCustomers(req, res){
    try {
        const customers = await db.query(`SELECT id, name, phone, cpf, TO_CHAR(birthday,'YYYY-MM-DD') as birthday FROM customers;`)
        res.send(customers.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomersById(req, res){
    const {id} = req.params
    try {
        const customer = await db.query(`SELECT id, name, phone, cpf, TO_CHAR(birthday,'YYYY-MM-DD') as birthday FROM customers WHERE id=$1;`,[id])
        if(customer.rowCount === 0) return res.sendStatus(404)
        customer
        res.send(customer.rows[0])
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function createCustomer(req, res){
    const {name, phone, cpf, birthday} = req.body
    const formatBday = formataBday(birthday)
    try {
        const cpfValidation = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf])
        if(cpfValidation.rowCount !== 0) return res.sendStatus(409)       
        const newCust = await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);`, [name, phone, cpf, formatBday])
        res.sendStatus(201) 
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function updateCustomer(req, res){
    const {id} = req.params
    const {name, phone, cpf, birthday} = req.body
    const formatBday = formataBday(birthday)
    try {
        const cpfValidation = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf])
        if(cpfValidation.rowCount !== 0 && cpfValidation.rows[0].id !== Number(id)) return res.sendStatus(409)
        const updateCust = await db.query(`UPDATE customers SET name=$1 , phone=$2 , cpf=$3 , birthday=$4 WHERE id=$5`, [name, phone, cpf, formatBday, id])
        if(updateCust.rowCount === 0) return res.sendStatus(404)
        res.sendStatus(200) 
    } catch (err) {
        res.status(500).send(err.message)
    }
}