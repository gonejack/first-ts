import {NewConsumer} from "./consumer";
import {sleep, time} from "../time/time";

const logger = console

async function testConsumer() {
    const consumer = new NewConsumer()

    try {
        await consumer.start()
        logger.info("启动完成")

        let n = 1e3
        while (n-- > 0) {
            const messages = await consumer.consume()

            logger.info("获取到消息: %O", messages)
        }
        await sleep(time.minute * 10)

        await consumer.stop()
        logger.info("关闭完成")
    } catch (e) {
        logger.error("发生错误: %s", e.message)
    }
}

testConsumer()
