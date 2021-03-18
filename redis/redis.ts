import * as Redis from "ioredis"

async function main() {
    const client = new Redis.Cluster([
        {host: "192.168.10.60", port: 6397},
        {host: "192.168.10.60", port: 6398},
        {host: "192.168.10.60", port: 6399},
    ], {
        enableReadyCheck:   true,
        enableOfflineQueue: false,
        redisOptions:       {
            password: "sunteng2019",
            reconnectOnError(err) {
                console.log("reconnectOnError")
                return true
            },
        },
    });

    try {
        client.on('error', (e) => {
            console.error(e.message)
        })
        await new Promise(res => client.on('ready', res))
    } catch (e) {
        console.error(e)
        return
    }

    console.log("sleeping")
    await new Promise(res => setTimeout(res, 20e3))
    console.log("sleeping end")

    let i = 1

    while (i++ < 10) {
        try {
            const set = await client.set("abc", "qq122321")
            const get = await client.get("abc")
            console.log(set, get)
        } catch (e) {
            console.log(e)
        }

        await new Promise(res => setTimeout(res, 5e3))
    }
}

main()
