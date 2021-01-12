import {StreamConsumer} from "./streamConsumer";
import {sleep, time} from "../time/time";

const logger = console

async function testStreamConsumer() {
    const consumer = new StreamConsumer()

    while (consumer.next()) {
        const message = await consumer.consume()

        logger.info("got: %s", message)

        await sleep(time.second * 2)
    }

    logger.info("quit")
}

testStreamConsumer()
