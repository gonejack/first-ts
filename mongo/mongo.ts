import * as Mongo from "mongodb"
import {MongoClientOptions} from "mongodb";
import * as url from "url";

async function main() {
    try {
        const uri = "mongodb://127.0.0.1:27017,127.0.0.1:27027,127.0.0.1:27037/?replicaSet=rs0"
        const opts: MongoClientOptions = {
            useNewUrlParser:  true,
            reconnectTries:   Number.MAX_VALUE,
            connectTimeoutMS: 20e3,
            socketTimeoutMS:  20e3,
            bufferMaxEntries: 0,
        }

        const client = await Mongo.connect(uri, opts)
        await client.db("db").collection("abc").insertOne({"abc": "def"})

        const list = await client.db("db").collection("abc").find({}).toArray()
        console.log(list)

        await client.close()
    } catch (e) {
        console.error(e)
    }
}

main()
