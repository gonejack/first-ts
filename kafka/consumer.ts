import * as Kafka from 'node-rdkafka'
import * as event from 'events';
import * as streams from 'stream';
import {ConsumerGlobalConfig, KafkaConsumer, TopicConfig} from "node-rdkafka";
import * as util from "util";

const logger = console

export class NewConsumer {
    private consumer: KafkaConsumer

    constructor() {
        const config: ConsumerGlobalConfig = {
            "group.id":             "test-group",
            "metadata.broker.list": "127.0.0.1:9092,127.0.0.1:9093",
            "error_cb":             this.onErr,
            "rebalance_cb":         this.onRebalanced,
            "consume_cb":           this.onConsume,
            "offset_commit_cb":     this.onCommit,
            'debug':                'all'
        }
        const topic: TopicConfig = {}

        this.consumer = new KafkaConsumer(config, topic)
        this.consumer.on("event.error", this.onEventError)
        // this.consumer.on("data", this.onData)
        this.consumer.on("event.log", this.onLog)
        this.consumer.on("event.stats", this.onStats)
        this.consumer.on("event.error", this.onErr)
        this.consumer.on("event.throttle", this.onThrottle)
    }

    private onEventError(event) {
        logger.debug("event.ERROR: %j", event);
    }

    async start() {
        const connect = new Promise((res, rej) => {
            this.consumer.connect({}, (err, data) => err ? rej(err) : res(data))
        })

        let timeout: NodeJS.Timeout = null;
        const ready = new Promise((res, rej) => {
            timeout = setTimeout(() => rej("等待超时"), 60e3)
            this.consumer.on("ready", (info, meta) => {
                this.consumer.subscribe(["test"])
                res(info)
            }).on("data", this.onData)
        })

        try {
            return await Promise.all([connect, ready])
        } catch (e) {
            throw new Error(util.format("启动出错: %s", e.message))
        } finally {
            clearTimeout(timeout)
        }
    }

    async stop() {
        const close = new Promise((res, rej) => {
            this.consumer.disconnect((err, data) => err ? rej(err) : res(data))
        })

        return await close
    }

    async consume() {
        const consume = new Promise((res, rej) => {
            this.consumer.consume(1, (err, messages) => err ? rej(err) : res(messages))
        })

        return await consume
    }

    onData(data) {
        logger.info("onData: %O", data)
    }

    onCommit(err, data) {
        logger.info("onCommit: %O %O", err, data)
    }

    onConsume(err, data) {
        logger.info("onConsume: %O %O", err, data)
    }

    onRebalanced(err, offsets) {
        logger.info("onRebalanced: %O %O", err, offsets)
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

class Consumer extends Kafka.KafkaConsumer {
    topicList: Kafka.SubscribeTopicList = [];
    onDataCB = (str: string) => {
    }
    stopped: boolean = false;
    interval: NodeJS.Timeout;

    constructor(config: Kafka.ConsumerGlobalConfig, topicConfig: Kafka.ConsumerTopicConfig, topicList: Kafka.SubscribeTopicList, cb: (msg: string) => void) {
        super(config, topicConfig);

        this.topicList = topicList;
        this.onDataCB = cb;

        this.on<"ready">("ready", this.onReady.bind(this));
        this.on<"rebalance">("rebalance", this.onRebalance.bind(this));
        this.on<"event.event">("event.event", this.onEventEvent.bind(this))
        this.on<"event.error">("event.error", this.onEventError.bind(this))
        this.on<"event.stats">("event.stats", this.onEventStats.bind(this))
        this.on<"event.log">("event.log", this.onEventLog.bind(this))
        this.on<"event.throttle">("event.throttle", this.onEventThrottle.bind(this));
        this.on<"disconnected">("disconnected", this.onDisconnected.bind(this));

        console.log("启动消费者");
        // this.start();
    }

    private start() {
        setTimeout(() => {
            if (!this.stopped) {
                console.log("正在建立连接");
                this.connect({}, (err, meta) => {
                    if (err) {
                        console.error("连接建立失败: %s", err.message);
                        this.start();
                    } else {
                        console.debug("连接已建立: %j", meta);
                    }
                });
            }
        }, 2e3);
    }

    public stop() {
        console.log("关闭消费者");

        this.stopped = true;
        this.close();
    }

    public stream() {

    }

    private onReady(readyInfo) {
        console.log("消费者就绪开始消费", readyInfo);

        if (this.subscription().length == 0) {
            this.subscribe(this.topicList);
        }

        this.interval = setInterval(() => {
            this.consume(1e3, this.onData.bind(this))
        }, 5e2);
    }

    private onRebalance(err, assignment) {
        console.log("消费组rebalance: %j", assignment);
    }

    private onData(err, messages) {
        if (err) {
            console.log("读取失败: %j", err);
            return
        }
        if (messages) {
            for (let message of messages) {
                console.debug("消费到消息", message.timestamp.toString(), message.value.toString());
                try {
                    this.onDataCB(message.value.toString());
                } catch (e) {
                    console.error("消费处理失败: %j", e)
                }
            }
        }
    }

    private onEventEvent(event) {
        console.debug("event.event: %j", event);
    }

    private onEventError(event) {
        console.debug("event.ERROR: %j", event);

        this.close();
    }

    private onEventStats(event) {
        console.debug("event.stats: %j", event);
    }

    private onEventLog(event) {
        console.log("Kafka DEBUG: %j", event);
    }

    private onEventThrottle(event) {
        console.debug("event.throttle: %j", event);
    }

    private onDisconnected(metrics) {
        console.log("连接已关闭");

        if (!this.stopped) {
            console.log("即将重建连接");
            this.start();
        }
    }

    private close() {
        console.log("正在关闭连接");
        clearInterval(this.interval);
        this.disconnect();
    }
}



