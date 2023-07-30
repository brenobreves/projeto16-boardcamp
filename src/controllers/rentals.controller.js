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
    let {id} = req.params
    if(isNaN(Number(id)) || id.trim() === "") return res.sendStatus(404)
    try {
        const getRental = await db.query(`SELECT * FROM rentals WHERE id=$1;`,[Number(id)])
        if(getRental.rowCount === 0) return res.sendStatus(404)
        const rental = getRental.rows[0]
        if(rental.returnDate !== null) return res.sendStatus(400)
        const returnDate = dayjs()
        const daysToReturn = returnDate.diff(rental.rentDate,'d')
        const delay = daysToReturn - rental.daysRented
        let delayFee = 0
        if(delay > 0) delayFee+= delay*(rental.originalPrice/rental.daysRented)
        const endRental = await db.query(`UPDATE rentals SET "returnDate"=$1 , "delayFee"=$2 WHERE id=$3;`,[returnDate.format('YYYY-MM-DD'), delayFee, id])
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRental(req, res){
    let {id} = req.params
    if(isNaN(Number(id)) || id.trim() === "") return res.sendStatus(404)
    try {
        const getRental = await db.query(`SELECT * FROM rentals WHERE id=$1;`,[Number(id)])
        if(getRental.rowCount === 0) return res.sendStatus(404)
        const rental = getRental.rows[0]
        if(rental.returnDate === null) return res.sendStatus(400)
        const rmRental = await db.query(`DELETE FROM rentals WHERE id=$1;`,[id])
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}