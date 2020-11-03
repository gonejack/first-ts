import {MyConsumer} from "./consumer_js";
import {sleep, time} from "../time/time";

const logger = console

async function testConsumer() {
    let consumer = new MyConsumer()

    logger.info("开始启动")
    await consumer.start()
    logger.info("启动完成")

    while (await consumer.next()) {
        const message = await consumer.consume()
        logger.info("读取到: %s", message)
    }

    logger.info("出错: %O", consumer.error())
    await sleep(time.minute * 10)

    logger.info("开始关闭")
    await consumer.stop()
    logger.info("关闭完成")
}

testConsumer()
