import * as rk from 'node-rdkafka'
import * as event from 'events';
import * as streams from 'stream';

class Consumer extends rk.KafkaConsumer {
    topicList: rk.SubscribeTopicList = [];
    onDataCB = (str: string) => {
    }
    stopped: boolean = false;
    interval: NodeJS.Timeout;

    constructor(config: rk.ConsumerGlobalConfig, topicConfig: rk.ConsumerTopicConfig, topicList: rk.SubscribeTopicList, cb: (msg: string) => void) {
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

// const consumer = new Consumer(config, {}, ["test_topic"], (msg) => {
//     console.log("处理消息: %s", msg);
// });

const config: rk.ConsumerGlobalConfig = {
    'group.id':             'test_group',
    'metadata.broker.list': '192.168.11.30:9093,192.168.11.31:9093,192.168.11.32:9093',

    'offset_commit_cb': (err, topicPartitions) => {
        if (err) {
            console.error('提交偏移量出错', err); // There was an error committing
        } else {
            console.debug('已提交偏移量', topicPartitions); // Commit went through. Let's log the topic partitions
        }
    },
    // 'debug': 'consumer,cgrp,topic,fetch',
    'debug':            'all'
};
const stream = rk.KafkaConsumer.createReadStream(config, {}, {topics: ["test_topic"]});

stream.on("error", err => {
    console.log("err: %s", err.message);
});
stream.on("data", msg => {
    console.log("data", msg.value.toString());
});
stream.on("close", () => {
    console.log("close");
})
stream.on("end", () => {
    console.log("end");
})
stream.consumer.on("event.log", (ev) => {
    console.log("Kafka DEBUG: %j", ev);
})

setTimeout(() => {
    stream.close();
}, 180e3);
