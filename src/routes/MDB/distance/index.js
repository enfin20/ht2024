import { connectToDatabase } from "$lib/db";
import { Double, ObjectId } from "mongodb";

export async function get(request) {
  try {
    const start = request.query.get("debutParcours");
    const end = request.query.get("finParcours");
    const freq = request.query.get("freq");
    const variante = request.query.get("variante");

    var filter = new Object();
    if (start != null) {
      filter = {
        $and: [{pos: {$gt: Number(start)}}, 
            {pos: {$lte: Number(end)}}, 
            {pos: {$mod: [Number(freq), 0]}}, 
            {variante: Number(variante)}
        ],
      };
    } else {
      filter = {};
    }
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Distance");
    const distance = await collection.find(filter).toArray();

    return {
      status: 200,
      body: {
        distance,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        erreur: err.message,
      },
    };
  }
}
