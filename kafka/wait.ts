export class Channel<T> {
    private getting: Array<(T) => void> = [];
    private putting: Array<() => void> = [];
    private cap: number
    private data: Array<T> = [];
    constructor(cap: number) {
        this.cap = cap;
    }
    public async put(data: T) {
        if (this.data.length >= this.cap) {
            await new Promise<void>(r => {
                this.putting.push(r)
            })
        }

        if (this.getting.length > 0) {
            this.getting.shift()(data)
        } else {
            this.data.push(data);
        }
    }
    public async get(): Promise<T> {
        if (this.putting.length > 0) {
            this.putting.shift()()
        }
        if (this.data.length == 0) {
            return await new Promise<T>(r => {
                this.getting.push(r)
            })
        } else {
            return this.data.shift();
        }
    }
}

const test = async () => {
    const c = new Channel<number>(1);

    put(c);
    get(c);
}

const put = async (c: Channel<number>) => {
    let i = 1;
    while (true) {
        await c.put(i)
    }
}

const get = async (c: Channel<number>) => {
    while (true) {
        const i = await c.get()
        console.log(i);
    }
}
