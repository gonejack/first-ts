import {Kafka, Consumer, EachMessagePayload} from 'kafkajs'

const logger = console

class slot<T> {
    private need: Promise<T>
    private needResolve: Function
    private offer: T
    private offerResolve: Function
    async get(): Promise<T> {
        if (this.offer) {
            const data = this.offer
            this.offerResolve()
            this.offer = null
            return data
        } else {
            this.need = new Promise<T>(res => {
                this.needResolve = res
            })
            return this.need
        }
    }
    async set(data: T): Promise<void> {
        if (this.need) {
            this.needResolve(data)
            this.need = null
        } else {
            const offer = new Promise<T>(res => {
                this.offer = data
                this.offerResolve = res
            })
            await offer
        }
    }
}

export class MyConsumer {
    private consumer: Consumer
    private stopped: boolean
    private crashed: boolean
    private slot = new slot<EachMessagePayload>()
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
        await this.consumer.run({eachMessage: async payload => await this.slot.set(payload)})
    }
    async stop() {
        await this.consumer.stop()
    }
    async next() {
        if (this.crashed || this.stopped) {
            await this.stop()
            return false
        }
        return true
    }
    async consume() {
        const payload = await this.slot.get()
        return payload.message.value.toString()
    }
    error() {
        if (this.crashed) {
            return new Error("crashed")
        }
        return null
    }
}
