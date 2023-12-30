import { connectToDatabase } from "$lib/db";
import { Double, ObjectId } from "mongodb";

export async function get(request) {
  try {
    const start = request.query.get("debutParcours");
    const end = request.query.get("finParcours");

    var filter = new Object();
    if (start != null) {
      filter = {
        $and: [{ pos: { $gt: Number(start) } }, { pos: { $lte: Number(end) } }],
      };
    } else {
      filter = {};
    }
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Parcours");
    const parcours = await collection.find(filter).toArray();
    for (var i = 0; i < parcours.length; i++) {
      parcours[i].key = parcours[i]._id;
    }

    return {
      status: 200,
      body: {
        parcours,
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
