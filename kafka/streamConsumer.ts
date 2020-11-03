import * as Kafka from "node-rdkafka";

const logger = console

export class StreamConsumer {
    private stream: Kafka.ConsumerStream

    constructor() {
        this.stream = Kafka.KafkaConsumer.createReadStream({
            'group.id':             'test_group',
            'metadata.broker.list': '127.0.0.1:9092,127.0.0.1:9093',
            'offset_commit_cb':     (err, topicPartitions) => {
                if (err) {
                    logger.error('提交偏移量出错', err); // There was an error committing
                } else {
                    logger.debug('已提交偏移量', topicPartitions); // Commit went through. Let's log the topic partitions
                }
            },
            // 'debug': 'consumer,cgrp,topic,fetch',
            'debug':                'all'
        }, {}, {topics: ["test"]})

        this.stream.on("error", this.onError);
        this.stream.on("data", this.onData);
        this.stream.on("close", this.onClose)
        this.stream.on("end", this.onEnd)
        this.stream.consumer.on("event.log", this.onLog)
        this.stream.consumer.on("event.stats", this.onStats)
        this.stream.consumer.on("event.error", this.onErr)
        this.stream.consumer.on("event.throttle", this.onThrottle)
    }
    onError(err) {
        logger.log("err: %s", err.message);
    }
    onData(msg) {
        logger.log("data", msg.value.toString());
    }
    onClose() {
        logger.log("close");
    }
    onEnd() {
        logger.log("end");
    }
    onLog(ev) {
        logger.log("Kafka DEBUG: %j", ev);
    }
    onStats(data) {
        logger.log("Kafka STATS: %j", data);
    }
    onErr(error) {
        logger.log("Kafka ERROR: %j", error);
    }
    onThrottle(data) {
        logger.log("Kafka THROTTLE: %j", data);
    }
}
