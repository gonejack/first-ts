import * as Kafka from "node-rdkafka"

const logger = console

export class Producer {
    private producer: Kafka.Producer

    constructor() {
        this.producer = new Kafka.Producer({
            'metadata.broker.list': '127.0.0.1:9092,127.0.0.1:9093',
            'api.version.request':  true,
            // 'dr_cb':                false,
        })
        this.producer.setPollInterval(100);
    }

    async start() {
        const connectPromise = new Promise((res, rej) => {
            this.producer
                .on('delivery-report', (err, report) => logger.debug("错误: %O, 递送报告: %O", err, report))
                .on('event.error', (err) => {
                    logger.error("生产者出错：", err);
                    rej(err);
                })
                .on("ready", () => {
                    logger.info("生产端连接已就绪");
                    res(true);
                });
        });

        this.producer.connect();

        return await connectPromise;
    }

    async stop() {
        const stop = new Promise((res, rej) => {
            this.producer.disconnect((err, data) => err ? rej(err) : res(data))
        })

        return await stop
    }

    async send(data: string | object, topic: string) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        data = JSON.stringify({
            INDEX:           '',
            SOURCE_TYPE:     '',
            FILE_NAME:       '',
            SOURCE_HOST:     '',
            AGENT_TIMESTAMP: '',
            LOG:             data,
            TOPIC:           '',
            FILE_PATH:       '',
        });

        logger.info('发送消息 topic=%s, data=%s', topic, data);
        try {
            await this.producer.produce(topic, null, new Buffer(data));
            logger.debug("发送消息完成 topic=%s, data=%s", topic, data);
            return true;
        } catch (e) {
            logger.error('发送消息失败 topic=%s, data=%s', topic, data, e);
            return false;
        }
    }

    async checkHealth() {
        const get = new Promise((res, rej) => {
            this.producer.getMetadata({timeout: 10e3}, (err, data) => err ? rej(err) : res(data))
        })

        try {
            const data = await get

            logger.debug(data)
            logger.debug("健康检查完成");

            return true
        } catch (e) {
            logger.error("健康检查失败: %s", e);
            return false
        }
    }
}


