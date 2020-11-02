import {Producer} from "./producer";
import * as util from "util"
import {sleep, time} from "../time/time";

const logger = console

async function testProducer() {
    const producer = new Producer()

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

testProducer()
