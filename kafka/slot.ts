export class Slot<T> {
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
