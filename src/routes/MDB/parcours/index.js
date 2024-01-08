import { connectToDatabase } from "$lib/db";
import { Double, ObjectId } from "mongodb";

export async function get(request) {
  try {
    const variante = request.query.get("variante") || 1;
    const start = request.query.get("debutParcours")||1;
    const end = request.query.get("finParcours") || 5000000;
    const pipeline = 
[
    {
        '$match': {
            '$and': [
                {
                    'variante': Number(variante)
                }, {
                    'pos': {
                        '$gt': Number(start)
                    }
                }, {
                    'pos': {
                        '$lte': Number(end)
                    }
                }
            ]
        }
    }, {
        '$lookup': {
            'from': 'Parcours', 
            'localField': 'pos', 
            'foreignField': 'pos', 
            'as': 'distance_parcours'
        }
    }, {
        '$unwind': {
            'path': '$distance_parcours'
        }
    }
      ];
    console.info("start", start)
    console.info("end",end)
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Distance");
    const parcours = await collection.aggregate(pipeline).limit(3000).toArray();
    for (var i = 0; i < parcours.length; i++) {
      parcours[i].key = parcours[i]._id;
      parcours[i].dist = parcours[i].distance_parcours.dist;
      parcours[i].elepos = parcours[i].distance_parcours.elepos;
      parcours[i].eleneg = parcours[i].distance_parcours.eleneg;
      parcours[i].lat = parcours[i].distance_parcours.lat;
      parcours[i].lng = parcours[i].distance_parcours.lng;
    }
console.info("parcours.length",parcours.length)

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
