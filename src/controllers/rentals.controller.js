import {db} from "../database/database.connection.js"

export async function getRentals(req, res){
    res.send("getRentals")
}

export async function createRental(req, res){
    res.send("createRental")
}

export async function returnRental(req, res){
    res.send("returnRental")
}

export async function deleteRental(req, res){
    res.send("deleteRental")
}