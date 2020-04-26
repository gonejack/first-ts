import * as mongo  from 'mongodb'

export class MongoTest {
    async connect() {
        const client = await mongo.connect('mongodb://192.168.10.60,192.18.10.41,192.168.10.51,192.168.11.31:28001/td', {
            useUnifiedTopology      : true,
            serverSelectionTimeoutMS: 5e3
        })
        const collect = client.db().collection("Account")
        const data = await collect.findOne({})


        await client.close()
    }
}

new MongoTest().connect().then(() => {
    console.log("done");
}, (reason) => {
    console.error(reason);
});
