import {Kafka, Consumer, EachMessagePayload} from 'kafkajs'

const logger = console

export class MyConsumer {
    private consumer: Consumer
    private stopped: boolean
    private crashed: boolean
    private queue = new Array<EachMessagePayload>()
    private available = 50
    private pushLock: Promise<void>
    private pushUnLock: Function
    private pullLock: Promise<void>
    private pullUnLock: Function

    constructor() {
        const kafka = new Kafka({
            clientId: 'my-app',
            brokers:  ['127.0.0.1:9092', '127.0.0.1:9093'],
        })
        this.consumer = kafka.consumer({groupId: "test-group"})
        this.consumer.on(this.consumer.events.GROUP_JOIN, logger.info)
        this.consumer.on(this.consumer.events.CONNECT, logger.info)
        this.consumer.on(this.consumer.events.DISCONNECT, logger.info)
        this.consumer.on(this.consumer.events.STOP, (msg) => {
            logger.info(msg)
            this.stopped = true
        })
        this.consumer.on(this.consumer.events.CRASH, (msg) => {
            logger.info(msg)
            this.crashed = true
        })
    }

    async start() {
        await this.consumer.connect()
        await this.consumer.subscribe({topic: "test"})
        await this.consumer.run({
            eachMessage: this.enqueue
        })
    }

    async enqueue(payload: EachMessagePayload) {
        if (this.available > 0) {
            this.queue.push(payload)
            this.available -= 1
        } else {
            while (this.pushLock) {
                await this.pushLock
            }
            this.pushLock = new Promise((res, rej) => {
                this.pushUnLock = () => {
                    this.pushUnLock = null;
                    res();
                }
            })
            await this.pushLock
        }
    }

    async stop() {
        await this.consumer.stop()
    }

    async next() {
        return !(this.crashed || this.stopped);
    }

    async consume() {
        while (this.queue.length == 0) {
            while (this.pullLock) {
                await this.pullLock
            }
            this.pullLock = new Promise<void>(res => {
                this.pullUnLock = () => {this.pullUnLock = null; res()}
            })
            await this.pullLock
        }

        const data = this.queue.shift()
        if (this.pushUnLock) {
            this.pushUnLock()
        }
        return data.message.value.toString()
    }

    error() {
        if (this.crashed) {
            return new Error("crashed")
        }
        return null
    }
}
