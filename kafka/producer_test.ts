import {Producer} from "./producer";
import * as util from "util"
import {sleep, time} from "../time/time";

const logger = console
const producer = new Producer()

async function testProducer() {
    const started = await producer.start()
    logger.info("已启动: %s", started)

    let n = 1e3
    while (n-- > 0) {
        const message = util.format("test message %d", n)
        await producer.send(message, "test")
        await sleep(time.second)
    }

    const stopped = await producer.stop()
    logger.info("已停止: %s", stopped)
}

async function testHealth() {
    let n = 1e3
    while (n-- > 0 ) {
        await sleep(time.second * 5)
        await producer.checkHealth()
    }
}

testProducer()
testHealth()
