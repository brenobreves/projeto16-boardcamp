import dayjs from "dayjs"
import {db} from "../database/database.connection.js"

export async function getRentals(req, res){
    res.send("getRentals")
}

export async function createRental(req, res){
    const {customerId , gameId , daysRented} = req.body
    const rentDate = dayjs().format('YYYY-MM-DD')
    try {
        const getCust = await db.query(`SELECT id, name, phone, cpf, TO_CHAR(birthday,'YYYY-MM-DD') as birthday FROM customers WHERE id=$1;`,[customerId])
        if(getCust.rowCount === 0) return res.sendStatus(400)
        const getGame = await db.query(`SELECT * FROM games WHERE id=$1;`,[gameId])
        if(getGame.rowCount === 0) return res.sendStatus(400)
        const customer = getCust.rows[0]
        const game = getGame.rows[0]
        const rentValidation = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1;`,[gameId])
        if(game.stockTotal <= rentValidation.rowCount) return res.sendStatus(400)
        const originalPrice = Number(daysRented)*Number(game.pricePerDay)
        const newRental = await db.query(`INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","originalPrice") 
            VALUES ($1,$2,$3,$4,$5);`,[Number(customerId),Number(gameId),rentDate,Number(daysRented),originalPrice])
        res.sendStatus(201)    
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function returnRental(req, res){
    res.send("returnRental")
}

export async function deleteRental(req, res){
    res.send("deleteRental")
}